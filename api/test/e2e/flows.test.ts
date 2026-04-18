import { describe, expect, test } from 'bun:test';
import { apiFetch } from '../helpers/api';

function json(res: Response) {
  return res.json() as Promise<Record<string, unknown>>;
}

describe('user flows (end-to-end)', () => {
  test('register → GET /me → PUT client-state → GET /me reflects saved state', async () => {
    const email = `flow-${crypto.randomUUID()}@example.com`;
    const password = 'password123';

    const reg = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    expect(reg.status).toBe(200);
    const { token } = await json(reg);

    const me1 = await apiFetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(me1.status).toBe(200);
    expect((await json(me1)).clientState).toEqual({});

    const put = await apiFetch('/api/me/client-state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: { quizProgress: { done: 3 } } }),
    });
    expect(put.status).toBe(200);

    const me2 = await apiFetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(me2.status).toBe(200);
    const body = await json(me2);
    expect(body.user).toEqual({ id: expect.any(String), email });
    expect(body.clientState).toEqual({ quizProgress: { done: 3 } });
    expect(typeof body.clientStateUpdatedAt).toBe('number');
  });

  test('register → login → GET /me (returning user)', async () => {
    const email = `return-${crypto.randomUUID()}@example.com`;
    const password = 'password123';

    await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
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
    expect(body.user).toEqual({ id: expect.any(String), email });
    expect(body.clientState).toEqual({});
  });

  test('quiz sessions populate weekly and global leaderboards', async () => {
    const emailA = `leader-a-${crypto.randomUUID()}@example.com`;
    const emailB = `leader-b-${crypto.randomUUID()}@example.com`;
    const password = 'password123';

    const regA = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailA, password }),
    });
    const { token: tokenA } = await json(regA);

    const regB = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailB, password }),
    });
    const { token: tokenB } = await json(regB);

    const sessionA = await apiFetch('/api/quiz-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ mode: 'all', answered: 3, correct: 2 }),
    });
    expect(sessionA.status).toBe(200);

    const sessionB = await apiFetch('/api/quiz-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({ mode: 'all', answered: 2, correct: 2 }),
    });
    expect(sessionB.status).toBe(200);

    const boards = await apiFetch('/api/leaderboards', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    expect(boards.status).toBe(200);
    const body = await json(boards);

    expect(body.weekly.weekStartsAt).toEqual(expect.any(Number));
    expect(body.global.weekStartsAt).toBeNull();
    expect(body.weekly.rows[0].email).toBe(emailA);
    expect(body.weekly.rows[0].score).toBeGreaterThan(body.weekly.rows[1].score);
    expect(body.global.rows[0].isCurrentUser).toBe(true);
  });
});
