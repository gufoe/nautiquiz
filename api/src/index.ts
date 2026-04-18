import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { eq } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { db } from './db';
import * as schema from './db/schema';
import { signUserToken, verifyUserToken } from './lib/jwt';
import { hashPassword, verifyPassword } from './lib/password';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = `${__dirname}/../drizzle`;

await migrate(db, { migrationsFolder });

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

const api = new Hono<{ Variables: Variables }>();

api.post('/auth/register', async (c) => {
  const body = await c.req.json<{ email?: string; password?: string }>();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }
  if (!isValidEmail(email)) {
    return c.json({ error: 'Invalid email' }, 400);
  }
  if (password.length < 8) {
    return c.json({ error: 'Password must be at least 8 characters' }, 400);
  }

  const id = crypto.randomUUID();
  const passwordHash = hashPassword(password);
  const now = new Date();
  try {
    await db.insert(schema.users).values({
      id,
      email,
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
      return c.json({ error: 'Email already registered' }, 409);
    }
    throw e;
  }

  const token = await signUserToken(id);
  return c.json({ token, user: { id, email } });
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
  return c.json({ token, user: { id: row.id, email: row.email } });
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
    user: { id: user.id, email: user.email },
    clientState: data,
    clientStateUpdatedAt: state!.updatedAt.getTime(),
  });
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
      nextData = { ...prev, ...body.data };
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

app.route('/api', api);

console.log(`API listening on http://127.0.0.1:${PORT}`);
export default {
  port: PORT,
  fetch: app.fetch,
  // Bun will keep process alive; sqlite handle stays open
};
