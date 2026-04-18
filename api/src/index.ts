import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { and, desc, eq, gte, isNotNull, sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from './db';
import * as schema from './db/schema';
import { signUserToken, verifyUserToken } from './lib/jwt';
import { hashPassword, verifyPassword } from './lib/password';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = `${__dirname}/../drizzle`;

type QuizKind = 'base' | 'vela' | '5d' | '42d';

const LEGACY_STATE_KEY_BY_KIND: Record<QuizKind, string> = {
  base: 'history',
  vela: 'vela-history',
  '5d': '5d-history',
  '42d': '42d-history',
};

const LEGACY_SEEDED_MARKER = 'question-attempts-seeded-v1';

await migrate(db, { migrationsFolder });
await seedQuestionAttemptsFromClientState();

const PORT = Number(process.env.PORT ?? '3333');

type Variables = { userId: string };

const app = new Hono<{ Variables: Variables }>();

const uiOrigins = (process.env.UI_ORIGIN ?? 'http://localhost:9000,http://127.0.0.1:9000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  '*',
  cors({
    origin: uiOrigins,
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    credentials: true,
  }),
);

app.get('/health', (c) => c.json({ ok: true }));

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Normalized form stored in DB (lowercase). */
const USERNAME_RE = /^[a-z0-9_]{3,24}$/;

function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

function usernameValidationError(normalized: string): string | null {
  if (!normalized) return 'Username is required';
  if (!USERNAME_RE.test(normalized)) {
    return 'Username must be 3–24 characters: lowercase letters, numbers, underscore only';
  }
  return null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function mergeClientState(
  prev: Record<string, unknown>,
  next: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...prev };

  for (const [key, nextValue] of Object.entries(next)) {
    const prevValue = merged[key];

    if (Array.isArray(prevValue) && Array.isArray(nextValue)) {
      merged[key] = Array.from(new Set([...prevValue, ...nextValue]));
      continue;
    }

    if (isPlainObject(prevValue) && isPlainObject(nextValue)) {
      merged[key] = { ...prevValue, ...nextValue };
      continue;
    }

    merged[key] = nextValue;
  }

  return merged;
}

type QuizMode = 'all' | 'missing' | 'mistakes' | 'favs' | 'issues';

type LeaderboardQueryRow = {
  userId: string;
  username: string | null;
  quizCount: number;
  correctKnown: number;
  correctCount: number;
};

/** Serialized leaderboard row — never includes email or internal user ids. */
type PublicLeaderboardRow = {
  rank: number;
  username: string | null;
  /** Completed quiz sessions in this scope (weekly window or all time). */
  quizCount: number;
  /** Share of answers correct in this scope, 0–1 (sum correct / sum answered). */
  accuracy: number;
  isCurrentUser: boolean;
};

function sanitizeQuizMode(value: unknown): QuizMode {
  const mode = typeof value === 'string' ? value : '';
  if (
    mode === 'all' ||
    mode === 'missing' ||
    mode === 'mistakes' ||
    mode === 'favs' ||
    mode === 'issues'
  ) {
    return mode;
  }
  return 'all';
}

function sanitizeQuizKind(value: unknown): QuizKind | null {
  if (value === 'base' || value === 'vela' || value === '5d' || value === '42d') {
    return value;
  }
  return null;
}

async function fetchLatestHistoryMap(
  userId: string,
  kind: QuizKind,
): Promise<Record<string, number>> {
  const attempts = await db
    .select({
      questionId: schema.questionAttempts.questionId,
      selectedAnswer: schema.questionAttempts.selectedAnswer,
      answeredAt: schema.questionAttempts.answeredAt,
      id: schema.questionAttempts.id,
    })
    .from(schema.questionAttempts)
    .where(
      and(
        eq(schema.questionAttempts.userId, userId),
        eq(schema.questionAttempts.quizKind, kind),
      ),
    );

  attempts.sort((a, b) => {
    const at = a.answeredAt.getTime();
    const bt = b.answeredAt.getTime();
    if (at !== bt) return bt - at;
    return b.id.localeCompare(a.id);
  });

  const latest = new Map<number, number>();
  for (const row of attempts) {
    if (!latest.has(row.questionId)) {
      latest.set(row.questionId, row.selectedAnswer);
    }
  }
  return Object.fromEntries(
    Array.from(latest.entries()).map(([questionId, selectedAnswer]) => [
      String(questionId),
      selectedAnswer,
    ]),
  );
}

const LEADERBOARD_TIME_ZONE = 'Europe/Rome';

function getZonedParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const parts = formatter.formatToParts(date);
  const lookup = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;
  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    hour: Number(lookup.hour ?? 0),
    minute: Number(lookup.minute ?? 0),
    second: Number(lookup.second ?? 0),
  };
}

function zonedTimeToUtc(parts: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}, timeZone: string) {
  const utcGuess = new Date(
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
      0,
    ),
  );
  const actual = getZonedParts(utcGuess, timeZone);
  const actualAsUtc = Date.UTC(
    actual.year,
    actual.month - 1,
    actual.day,
    actual.hour,
    actual.minute,
    actual.second,
    0,
  );
  return new Date(utcGuess.getTime() - (actualAsUtc - utcGuess.getTime()));
}

function getWeekStartRome(now = new Date()): Date {
  const romeNow = getZonedParts(now, LEADERBOARD_TIME_ZONE);
  const weekDay = new Intl.DateTimeFormat('en-US', {
    timeZone: LEADERBOARD_TIME_ZONE,
    weekday: 'short',
  }).format(now);
  const dayIndex =
    weekDay === 'Mon'
      ? 0
      : weekDay === 'Tue'
        ? 1
        : weekDay === 'Wed'
          ? 2
          : weekDay === 'Thu'
            ? 3
            : weekDay === 'Fri'
              ? 4
              : weekDay === 'Sat'
                ? 5
                : 6;
  return zonedTimeToUtc(
    {
      year: romeNow.year,
      month: romeNow.month,
      day: romeNow.day - dayIndex,
      hour: 0,
      minute: 0,
      second: 0,
    },
    LEADERBOARD_TIME_ZONE,
  );
}

function toPublicLeaderboardRows(
  rows: LeaderboardQueryRow[],
  currentUserId: string,
): PublicLeaderboardRow[] {
  return rows.map((row, index) => ({
    rank: index + 1,
    username: row.username,
    quizCount: row.quizCount,
    accuracy:
      row.correctKnown > 0 ? row.correctCount / row.correctKnown : 0,
    isCurrentUser: row.userId === currentUserId,
  }));
}

function countHistoryEntries(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  if (isPlainObject(value)) return Object.keys(value).length;
  return 0;
}

function parseStateObject(dataJson: string | null | undefined): Record<string, unknown> {
  if (!dataJson) return {};
  try {
    return JSON.parse(dataJson) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function normalizeAttemptEntries(value: unknown): Array<[number, number]> {
  if (!isPlainObject(value)) return [];
  return Object.entries(value)
    .map(([questionIdRaw, selectedRaw]) => {
      const questionId = Number(questionIdRaw);
      const selected = Number(selectedRaw);
      return [questionId, selected] as [number, number];
    })
    .filter(([questionId, selected]) =>
      Number.isInteger(questionId) && Number.isInteger(selected),
    );
}

async function seedQuestionAttemptsFromClientState() {
  const now = Date.now();
  const gufoeLegacyTs = now - 365 * 24 * 60 * 60 * 1000;
  const rows = await db
    .select({
      userId: schema.users.id,
      username: schema.users.username,
      dataJson: schema.userClientState.dataJson,
      updatedAt: schema.userClientState.updatedAt,
    })
    .from(schema.users)
    .leftJoin(
      schema.userClientState,
      eq(schema.userClientState.userId, schema.users.id),
    );

  for (const row of rows) {
    const state = parseStateObject(row.dataJson);
    if (state[LEGACY_SEEDED_MARKER] === true) continue;

    const sourceTs = row.username === 'gufoe'
      ? gufoeLegacyTs
      : Math.max(now, row.updatedAt?.getTime() ?? now);
    const inserts = (Object.keys(LEGACY_STATE_KEY_BY_KIND) as QuizKind[]).flatMap((kind) =>
      normalizeAttemptEntries(state[LEGACY_STATE_KEY_BY_KIND[kind]]).map(
        ([questionId, selectedAnswer]) => ({
          id: crypto.randomUUID(),
          userId: row.userId,
          quizKind: kind,
          questionId,
          selectedAnswer,
          isCorrect: null,
          answeredAt: new Date(sourceTs),
          source: 'legacy',
        }),
      ),
    );

    await db.transaction(async (tx) => {
      if (inserts.length > 0) {
        await tx.insert(schema.questionAttempts).values(inserts);
      }
      const nextState = { ...state, [LEGACY_SEEDED_MARKER]: true };
      await tx
        .update(schema.userClientState)
        .set({ dataJson: JSON.stringify(nextState), updatedAt: new Date(now) })
        .where(eq(schema.userClientState.userId, row.userId));
    });
  }
}

async function fetchLeaderboard(
  userId: string,
  scope: 'weekly' | 'global',
): Promise<{
  scope: 'weekly' | 'global';
  weekStartsAt: number | null;
  rows: PublicLeaderboardRow[];
}> {
  const weekStart = scope === 'weekly' ? getWeekStartRome() : null;
  const rows = await db
    .select({
      userId: schema.users.id,
      username: schema.users.username,
      quizCount: sql<number>`coalesce(count(${schema.questionAttempts.id}), 0)`,
      correctKnown: sql<number>`coalesce(sum(case when ${schema.questionAttempts.isCorrect} is not null then 1 else 0 end), 0)`,
      correctCount: sql<number>`coalesce(sum(case when ${schema.questionAttempts.isCorrect} = 1 then 1 else 0 end), 0)`,
    })
    .from(schema.users)
    .leftJoin(
      schema.questionAttempts,
      and(
        eq(schema.questionAttempts.userId, schema.users.id),
        scope === 'weekly' && weekStart
          ? gte(schema.questionAttempts.answeredAt, weekStart)
          : sql`1 = 1`,
      ),
    )
    .groupBy(schema.users.id, schema.users.username);

  const rankedRows = rows
    .filter((row) => row.quizCount > 0)
    .sort((a, b) => {
      if (a.quizCount !== b.quizCount) return b.quizCount - a.quizCount;
      return (a.username ?? '').localeCompare(b.username ?? '');
    })
    .slice(0, 100);

  return {
    scope,
    weekStartsAt: weekStart?.getTime() ?? null,
    rows: toPublicLeaderboardRows(rankedRows, userId),
  };
}

/** Public weekly snapshot: usernames only, no auth. Users without a username are omitted. */
async function fetchWeeklyTopPublic(limit: number) {
  const weekStart = getWeekStartRome();
  const rows = await db
    .select({
      username: schema.users.username,
      quizCount: sql<number>`coalesce(count(${schema.questionAttempts.id}), 0)`,
      correctKnown: sql<number>`coalesce(sum(case when ${schema.questionAttempts.isCorrect} is not null then 1 else 0 end), 0)`,
      correctCount: sql<number>`coalesce(sum(case when ${schema.questionAttempts.isCorrect} = 1 then 1 else 0 end), 0)`,
    })
    .from(schema.users)
    .leftJoin(
      schema.questionAttempts,
      and(
        eq(schema.questionAttempts.userId, schema.users.id),
        gte(schema.questionAttempts.answeredAt, weekStart),
      ),
    )
    .where(isNotNull(schema.users.username))
    .groupBy(schema.users.id, schema.users.username)
    .orderBy(
      desc(sql`coalesce(count(${schema.questionAttempts.id}), 0)`),
      schema.users.username,
    )
    .limit(limit);

  return {
    scope: 'weekly' as const,
    weekStartsAt: weekStart.getTime(),
    rows: rows
      .filter((row) => row.quizCount > 0)
      .slice(0, limit)
      .map((row, index) => ({
        rank: index + 1,
        username: row.username as string,
        quizCount: row.quizCount,
        accuracy:
          row.correctKnown > 0 ? row.correctCount / row.correctKnown : 0,
      })),
  };
}

const api = new Hono<{ Variables: Variables }>();

api.post('/auth/register', async (c) => {
  const body = await c.req.json<{
    email?: string;
    password?: string;
    username?: string;
  }>();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const usernameRaw = body.username;
  const username =
    typeof usernameRaw === 'string' ? normalizeUsername(usernameRaw) : '';

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }
  if (!isValidEmail(email)) {
    return c.json({ error: 'Invalid email' }, 400);
  }
  if (password.length < 8) {
    return c.json({ error: 'Password must be at least 8 characters' }, 400);
  }
  const uErr = usernameValidationError(username);
  if (uErr) {
    return c.json({ error: uErr }, 400);
  }

  const id = crypto.randomUUID();
  const passwordHash = hashPassword(password);
  const now = new Date();
  try {
    await db.insert(schema.users).values({
      id,
      email,
      username,
      passwordHash,
      createdAt: now,
    });
    await db.insert(schema.userClientState).values({
      userId: id,
      dataJson: '{}',
      updatedAt: now,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('UNIQUE') || msg.includes('unique')) {
      if (msg.toLowerCase().includes('username')) {
        return c.json({ error: 'Username already taken' }, 409);
      }
      return c.json({ error: 'Email already registered' }, 409);
    }
    throw e;
  }

  const token = await signUserToken(id);
  return c.json({ token, user: { id, email, username } });
});

api.post('/auth/login', async (c) => {
  const body = await c.req.json<{ email?: string; password?: string }>();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  const users = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  const row = users[0];
  if (!row || !verifyPassword(password, row.passwordHash)) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  let stateRows = await db
    .select()
    .from(schema.userClientState)
    .where(eq(schema.userClientState.userId, row.id))
    .limit(1);
  let state = stateRows[0];
  if (!state) {
    const now = new Date();
    await db.insert(schema.userClientState).values({
      userId: row.id,
      dataJson: '{}',
      updatedAt: now,
    });
    stateRows = await db
      .select()
      .from(schema.userClientState)
      .where(eq(schema.userClientState.userId, row.id))
      .limit(1);
    state = stateRows[0];
  }

  const token = await signUserToken(row.id);
  return c.json({
    token,
    user: {
      id: row.id,
      email: row.email,
      username: row.username ?? null,
    },
  });
});

api.get('/leaderboards/weekly-top', async (c) => {
  const data = await fetchWeeklyTopPublic(3);
  return c.json(data);
});

api.use('*', async (c, next) => {
  const h = c.req.header('Authorization');
  if (!h?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = h.slice(7);
  try {
    const { userId } = await verifyUserToken(token);
    c.set('userId', userId);
    await next();
  } catch {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

api.use('*', async (c, next) => {
  const path = c.req.path;
  const method = c.req.method;
  // Nested `api` app is mounted at `/api`; `c.req.path` is the full path (e.g. `/api/me`).
  if (method === 'GET' && path === '/api/me') return next();
  if (method === 'PUT' && path === '/api/me/username') return next();
  if (method === 'PUT' && path === '/api/me/password') return next();
  if (method === 'POST' && path === '/api/quiz-attempts/batch') return next();
  if (method === 'GET' && path.startsWith('/api/quiz-progress/')) return next();

  const userId = c.get('userId');
  const urows = await db
    .select({ username: schema.users.username })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);
  if (!urows[0]?.username) {
    return c.json(
      { error: 'Username required', code: 'USERNAME_REQUIRED' },
      403,
    );
  }
  return next();
});

api.get('/me', async (c) => {
  const userId = c.get('userId');
  const userRows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);
  const user = userRows[0];
  if (!user) return c.json({ error: 'Not found' }, 404);

  let stateRows = await db
    .select()
    .from(schema.userClientState)
    .where(eq(schema.userClientState.userId, userId))
    .limit(1);
  let state = stateRows[0];
  if (!state) {
    const now = new Date();
    await db.insert(schema.userClientState).values({
      userId,
      dataJson: '{}',
      updatedAt: now,
    });
    stateRows = await db
      .select()
      .from(schema.userClientState)
      .where(eq(schema.userClientState.userId, userId))
      .limit(1);
    state = stateRows[0];
  }

  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(state!.dataJson) as Record<string, unknown>;
  } catch {
    data = {};
  }

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username ?? null,
    },
    clientState: data,
    clientStateUpdatedAt: state!.updatedAt.getTime(),
  });
});

api.put('/me/username', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<{ username?: string }>();
  const normalized =
    typeof body.username === 'string' ? normalizeUsername(body.username) : '';
  const err = usernameValidationError(normalized);
  if (err) return c.json({ error: err }, 400);

  const existing = await db
    .select({ username: schema.users.username })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);
  if (!existing[0]) return c.json({ error: 'Not found' }, 404);

  try {
    await db
      .update(schema.users)
      .set({ username: normalized })
      .where(eq(schema.users.id, userId));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('UNIQUE') || msg.includes('unique')) {
      return c.json({ error: 'Username already taken' }, 409);
    }
    throw e;
  }

  const row = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);
  const u = row[0]!;
  return c.json({
    user: { id: u.id, username: u.username ?? null },
  });
});

api.put('/me/password', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<{
    currentPassword?: string;
    newPassword?: string;
  }>();
  const currentPassword = body.currentPassword;
  const newPassword = body.newPassword;
  if (
    typeof currentPassword !== 'string' ||
    typeof newPassword !== 'string' ||
    !currentPassword ||
    !newPassword
  ) {
    return c.json(
      { error: 'Current password and new password are required' },
      400,
    );
  }
  if (newPassword.length < 8) {
    return c.json({ error: 'Password must be at least 8 characters' }, 400);
  }

  const userRows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);
  const row = userRows[0];
  if (!row) return c.json({ error: 'Not found' }, 404);
  if (!verifyPassword(currentPassword, row.passwordHash)) {
    return c.json({ error: 'Current password is incorrect' }, 401);
  }

  await db
    .update(schema.users)
    .set({ passwordHash: hashPassword(newPassword) })
    .where(eq(schema.users.id, userId));

  return c.json({ ok: true });
});

api.put('/me/client-state', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<{
    data?: Record<string, unknown>;
    merge?: boolean;
  }>();
  if (!body.data || typeof body.data !== 'object') {
    return c.json({ error: 'Expected { data: object }' }, 400);
  }

  const existingRows = await db
    .select()
    .from(schema.userClientState)
    .where(eq(schema.userClientState.userId, userId))
    .limit(1);
  const existing = existingRows[0];

  let nextData: Record<string, unknown> = { ...body.data };
  if (body.merge !== false && existing) {
    try {
      const prev = JSON.parse(existing.dataJson) as Record<string, unknown>;
      nextData = mergeClientState(prev, body.data);
    } catch {
      nextData = { ...body.data };
    }
  }

  const now = new Date();
  if (existing) {
    await db
      .update(schema.userClientState)
      .set({ dataJson: JSON.stringify(nextData), updatedAt: now })
      .where(eq(schema.userClientState.userId, userId));
  } else {
    await db.insert(schema.userClientState).values({
      userId,
      dataJson: JSON.stringify(nextData),
      updatedAt: now,
    });
  }

  return c.json({ ok: true, clientState: nextData });
});

api.get('/quiz-progress/:kind', async (c) => {
  const userId = c.get('userId');
  const kind = sanitizeQuizKind(c.req.param('kind'));
  if (!kind) {
    return c.json({ error: 'Invalid quiz kind' }, 400);
  }
  const history = await fetchLatestHistoryMap(userId, kind);
  return c.json({ quizKind: kind, history });
});

api.post('/quiz-attempts/batch', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<{
    attempts?: Array<{
      id?: unknown;
      quizKind?: unknown;
      questionId?: unknown;
      selectedAnswer?: unknown;
      isCorrect?: unknown;
      answeredAt?: unknown;
    }>;
  }>();

  const raw = Array.isArray(body.attempts) ? body.attempts : [];
  const attempts = raw
    .map((entry) => {
      const id = typeof entry.id === 'string' && entry.id ? entry.id : null;
      const quizKind = sanitizeQuizKind(entry.quizKind);
      const questionId = Number(entry.questionId);
      const selectedAnswer = Number(entry.selectedAnswer);
      const isCorrect =
        typeof entry.isCorrect === 'boolean' ? entry.isCorrect : null;
      const answeredAt = new Date(
        typeof entry.answeredAt === 'number' ? entry.answeredAt : Date.now(),
      );
      return { id, quizKind, questionId, selectedAnswer, isCorrect, answeredAt };
    })
    .filter(
      (entry) =>
        !!entry.id &&
        !!entry.quizKind &&
        Number.isInteger(entry.questionId) &&
        Number.isInteger(entry.selectedAnswer),
    );

  if (attempts.length === 0) {
    return c.json({ ok: true, accepted: 0 });
  }

  await db
    .insert(schema.questionAttempts)
    .values(
      attempts.map((entry) => ({
        id: entry.id!,
        userId,
        quizKind: entry.quizKind!,
        questionId: entry.questionId,
        selectedAnswer: entry.selectedAnswer,
        isCorrect: entry.isCorrect,
        answeredAt: entry.answeredAt,
        source: 'live',
      })),
    )
    .onConflictDoNothing({ target: schema.questionAttempts.id });

  return c.json({ ok: true, accepted: attempts.length });
});

api.post('/quiz-sessions', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json<{
    mode?: unknown;
    answered?: unknown;
    correct?: unknown;
    attempts?: Array<{
      quizKind?: unknown;
      questionId?: unknown;
      selectedAnswer?: unknown;
      isCorrect?: unknown;
      answeredAt?: unknown;
    }>;
  }>();

  const answered = Number(body.answered);
  const correct = Number(body.correct);
  if (!Number.isInteger(answered) || answered <= 0) {
    return c.json({ error: 'answered must be a positive integer' }, 400);
  }
  if (!Number.isInteger(correct) || correct < 0 || correct > answered) {
    return c.json({ error: 'correct must be an integer between 0 and answered' }, 400);
  }

  const mode = sanitizeQuizMode(body.mode);
  const now = new Date();
  const score = answered + correct;
  const attemptsInput = Array.isArray(body.attempts) ? body.attempts : [];

  const attempts = attemptsInput
    .map((entry) => {
      const quizKind = sanitizeQuizKind(entry.quizKind);
      const questionId = Number(entry.questionId);
      const selectedAnswer = Number(entry.selectedAnswer);
      const isCorrect =
        typeof entry.isCorrect === 'boolean' ? entry.isCorrect : null;
      const answeredAt = new Date(
        typeof entry.answeredAt === 'number' ? entry.answeredAt : now.getTime(),
      );
      return { quizKind, questionId, selectedAnswer, isCorrect, answeredAt };
    })
    .filter(
      (entry) =>
        !!entry.quizKind &&
        Number.isInteger(entry.questionId) &&
        Number.isInteger(entry.selectedAnswer),
    );

  await db.transaction(async (tx) => {
    await tx.insert(schema.quizSessions).values({
      id: crypto.randomUUID(),
      userId,
      mode,
      answered,
      correct,
      score,
      createdAt: now,
    });
    if (attempts.length > 0) {
      await tx.insert(schema.questionAttempts).values(
        attempts.map((entry) => ({
          id: crypto.randomUUID(),
          userId,
          quizKind: entry.quizKind!,
          questionId: entry.questionId,
          selectedAnswer: entry.selectedAnswer,
          isCorrect: entry.isCorrect,
          answeredAt: entry.answeredAt,
          source: 'live',
        })),
      );
    }
  });

  const [weekly, global] = await Promise.all([
    fetchLeaderboard(userId, 'weekly'),
    fetchLeaderboard(userId, 'global'),
  ]);

  return c.json({
    ok: true,
    session: {
      mode,
      answered,
      correct,
      score,
      createdAt: now.getTime(),
    },
    leaderboards: { weekly, global },
  });
});

api.get('/leaderboards', async (c) => {
  const userId = c.get('userId');
  const [weekly, global] = await Promise.all([
    fetchLeaderboard(userId, 'weekly'),
    fetchLeaderboard(userId, 'global'),
  ]);
  return c.json({ weekly, global });
});

app.route('/api', api);

console.log(`API listening on http://127.0.0.1:${PORT}`);
export default {
  port: PORT,
  fetch: app.fetch,
  // Bun will keep process alive; sqlite handle stays open
};
