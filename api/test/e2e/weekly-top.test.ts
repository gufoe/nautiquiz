import { describe, expect, test } from 'bun:test';
import { apiFetch } from '../helpers/api';
import { uniqueUsername } from '../helpers/username';

function json(res: Response) {
  return res.json() as Promise<Record<string, unknown>>;
}

describe('GET /api/leaderboards/weekly-top', () => {
  test('200 without Authorization — usernames only, no email', async () => {
    const res = await apiFetch('/api/leaderboards/weekly-top');
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.scope).toBe('weekly');
    expect(typeof body.weekStartsAt).toBe('number');
    expect(Array.isArray(body.rows)).toBe(true);
    const rows = body.rows as Record<string, unknown>[];
    expect(rows.length).toBeLessThanOrEqual(3);
    for (const row of rows) {
      expect(Object.keys(row).sort()).toEqual(
        ['accuracy', 'quizCount', 'rank', 'username'].sort(),
      );
      expect(typeof row.username).toBe('string');
    }
  });

  test('lists top players after a scored session', async () => {
    const email = `wt-${crypto.randomUUID()}@example.com`;
    const password = 'password123';
    const username = uniqueUsername();

    const reg = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });
    expect(reg.status).toBe(200);
    const { token } = await json(reg);

    const session = await apiFetch('/api/quiz-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mode: 'all', answered: 500, correct: 400 }),
    });
    expect(session.status).toBe(200);

    const top = await apiFetch('/api/leaderboards/weekly-top');
    expect(top.status).toBe(200);
    const body = await json(top);
    const rows = body.rows as Array<{ username: string; rank: number }>;
    const found = rows.find((r) => r.username === username);
    expect(found).toBeDefined();
    expect(found!.rank).toBeGreaterThanOrEqual(1);
    expect(found!.rank).toBeLessThanOrEqual(3);
  });
});
