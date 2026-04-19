import { describe, expect, test } from 'bun:test';
import { apiFetch } from '../helpers/api';
import { uniqueUsername } from '../helpers/username';

function json(res: Response) {
  return res.json() as Promise<Record<string, unknown>>;
}

type LeaderboardsBody = {
  weekly: { weekStartsAt: number; rows: Array<{ username: string; quizCount: number }> };
  global: {
    weekStartsAt: number | null;
    rows: Array<{ username: string; quizCount: number; isCurrentUser?: boolean }>;
  };
};

describe('user flows (end-to-end)', () => {
  test('register → GET /me → GET /quiz-histories (empty)', async () => {
    const email = `flow-${crypto.randomUUID()}@example.com`;
    const password = 'password123';
    const username = uniqueUsername();

    const reg = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });
    expect(reg.status).toBe(200);
    const { token } = await json(reg);

    const me1 = await apiFetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(me1.status).toBe(200);
    const meBody = await json(me1);
    expect(meBody.user).toEqual({ id: expect.any(String), email, username });

    const hist = await apiFetch('/api/quiz-histories', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(hist.status).toBe(200);
    const h = await json(hist);
    expect(h.base).toEqual({});
    expect(h.vela).toEqual({});
    expect(h['5d']).toEqual({});
    expect(h['42d']).toEqual({});
  });

  test('GET /quiz-lists and PUT replace favorites and issues', async () => {
    const email = `lists-${crypto.randomUUID()}@example.com`;
    const password = 'password123';
    const username = uniqueUsername();

    const reg = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });
    expect(reg.status).toBe(200);
    const { token } = await json(reg);

    const get0 = await apiFetch('/api/quiz-lists', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(get0.status).toBe(200);
    const empty = (await json(get0)) as {
      favorites: Record<string, number[]>;
      issues: Record<string, number[]>;
    };
    expect(empty.favorites.base).toEqual([]);
    expect(empty.issues.base).toEqual([]);

    const put = await apiFetch('/api/quiz-lists', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        favorites: { base: [1, 2], vela: [], '5d': [], '42d': [] },
        issues: { base: [9], vela: [], '5d': [], '42d': [] },
      }),
    });
    expect(put.status).toBe(200);

    const get1 = await apiFetch('/api/quiz-lists', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(get1.status).toBe(200);
    const data = (await json(get1)) as {
      favorites: Record<string, number[]>;
      issues: Record<string, number[]>;
    };
    expect(data.favorites.base).toEqual([1, 2]);
    expect(data.issues.base).toEqual([9]);
  });

  test('register → login → GET /me (returning user)', async () => {
    const email = `return-${crypto.randomUUID()}@example.com`;
    const password = 'password123';
    const username = uniqueUsername();

    await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

    const login = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    expect(login.status).toBe(200);
    const { token } = await json(login);

    const me = await apiFetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(me.status).toBe(200);
    const body = await json(me);
    expect(body.user).toEqual({ id: expect.any(String), email, username });
  });

  test('answer batches populate weekly and global leaderboards', async () => {
    const emailA = `leader-a-${crypto.randomUUID()}@example.com`;
    const emailB = `leader-b-${crypto.randomUUID()}@example.com`;
    const password = 'password123';
    const usernameA = uniqueUsername();
    const usernameB = uniqueUsername();

    const regA = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailA, password, username: usernameA }),
    });
    const { token: tokenA } = await json(regA);

    const regB = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailB, password, username: usernameB }),
    });
    const { token: tokenB } = await json(regB);

    const t = Date.now();
    const batchA1 = await apiFetch('/api/quiz-attempts/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        attempts: [
          {
            id: crypto.randomUUID(),
            quizKind: 'base',
            questionId: 1,
            selectedAnswer: 1,
            isCorrect: true,
            answeredAt: t,
          },
          {
            id: crypto.randomUUID(),
            quizKind: 'base',
            questionId: 2,
            selectedAnswer: 0,
            isCorrect: false,
            answeredAt: t,
          },
          {
            id: crypto.randomUUID(),
            quizKind: 'base',
            questionId: 3,
            selectedAnswer: 2,
            isCorrect: true,
            answeredAt: t,
          },
        ],
      }),
    });
    expect(batchA1.status).toBe(200);

    const batchA2 = await apiFetch('/api/quiz-attempts/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        attempts: [
          {
            id: crypto.randomUUID(),
            quizKind: 'base',
            questionId: 4,
            selectedAnswer: 1,
            isCorrect: true,
            answeredAt: t,
          },
        ],
      }),
    });
    expect(batchA2.status).toBe(200);

    const batchB = await apiFetch('/api/quiz-attempts/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({
        attempts: [
          {
            id: crypto.randomUUID(),
            quizKind: 'base',
            questionId: 1,
            selectedAnswer: 2,
            isCorrect: true,
            answeredAt: t,
          },
          {
            id: crypto.randomUUID(),
            quizKind: 'base',
            questionId: 2,
            selectedAnswer: 1,
            isCorrect: true,
            answeredAt: t,
          },
        ],
      }),
    });
    expect(batchB.status).toBe(200);

    const boards = await apiFetch('/api/leaderboards', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    expect(boards.status).toBe(200);
    const body = (await json(boards)) as LeaderboardsBody;

    expect(body.weekly.weekStartsAt).toEqual(expect.any(Number));
    expect(body.global.weekStartsAt).toBeNull();
    expect(body.weekly.rows[0].username).toBe(usernameA);
    expect(body.weekly.rows[0].quizCount).toBeGreaterThan(body.weekly.rows[1].quizCount);
    expect(body.global.rows[0].isCurrentUser).toBe(true);
  });

  test('quiz-progress exposes latest answer per question for a kind', async () => {
    const email = `progress-${crypto.randomUUID()}@example.com`;
    const password = 'password123';
    const username = uniqueUsername();

    const reg = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });
    expect(reg.status).toBe(200);
    const { token } = await json(reg);

    const first = await apiFetch('/api/quiz-attempts/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        attempts: [
          {
            id: crypto.randomUUID(),
            quizKind: 'base',
            questionId: 10,
            selectedAnswer: 1,
            isCorrect: true,
            answeredAt: Date.now() - 2000,
          },
          {
            id: crypto.randomUUID(),
            quizKind: 'base',
            questionId: 11,
            selectedAnswer: 0,
            isCorrect: false,
            answeredAt: Date.now() - 1000,
          },
        ],
      }),
    });
    expect(first.status).toBe(200);

    const second = await apiFetch('/api/quiz-attempts/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        attempts: [
          {
            id: crypto.randomUUID(),
            quizKind: 'base',
            questionId: 11,
            selectedAnswer: 2,
            isCorrect: true,
            answeredAt: Date.now(),
          },
        ],
      }),
    });
    expect(second.status).toBe(200);

    const progress = await apiFetch('/api/quiz-progress/base', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(progress.status).toBe(200);
    const body = await json(progress);
    expect(body.quizKind).toBe('base');
    expect(body.history).toEqual({ 10: 1, 11: 2 });
  });

  test('batch attempts update leaderboard without ending session', async () => {
    const email = `realtime-${crypto.randomUUID()}@example.com`;
    const password = 'password123';
    const username = uniqueUsername();

    const reg = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });
    expect(reg.status).toBe(200);
    const { token } = await json(reg);

    const put = await apiFetch('/api/quiz-attempts/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        attempts: [
          {
            id: crypto.randomUUID(),
            quizKind: 'base',
            questionId: 1,
            selectedAnswer: 0,
            isCorrect: false,
            answeredAt: Date.now(),
          },
        ],
      }),
    });
    expect(put.status).toBe(200);

    const boards = await apiFetch('/api/leaderboards', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(boards.status).toBe(200);
    const body = (await json(boards)) as LeaderboardsBody;
    const row = body.global.rows.find((entry) => entry.username === username);
    expect(row).toBeDefined();
    expect(row!.quizCount).toBeGreaterThanOrEqual(1);
  });
});
