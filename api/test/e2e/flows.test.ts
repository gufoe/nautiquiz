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
});
