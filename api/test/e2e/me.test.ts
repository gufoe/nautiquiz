import { describe, expect, test } from 'bun:test';
import { apiFetch } from '../helpers/api';

function json(res: Response) {
  return res.json() as Promise<Record<string, unknown>>;
}

async function registerAndToken(): Promise<{ token: string; email: string }> {
  const email = `me-${crypto.randomUUID()}@example.com`;
  const password = 'password123';
  const res = await apiFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  expect(res.status).toBe(200);
  const body = await json(res);
  return { token: body.token as string, email };
}

describe('GET /api/me', () => {
  test('401 without Authorization', async () => {
    const res = await apiFetch('/api/me');
    expect(res.status).toBe(401);
    expect(await json(res)).toEqual({ error: 'Unauthorized' });
  });

  test('401 with malformed Authorization header', async () => {
    const res = await apiFetch('/api/me', {
      headers: { Authorization: 'NotBearer x' },
    });
    expect(res.status).toBe(401);
    expect(await json(res)).toEqual({ error: 'Unauthorized' });
  });

  test('401 with invalid token', async () => {
    const res = await apiFetch('/api/me', {
      headers: { Authorization: 'Bearer invalid.jwt.here' },
    });
    expect(res.status).toBe(401);
    expect(await json(res)).toEqual({ error: 'Unauthorized' });
  });

  test('200 returns user and empty client state', async () => {
    const { token, email } = await registerAndToken();
    const res = await apiFetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.user).toEqual({ id: expect.any(String), email });
    expect(body.clientState).toEqual({});
    expect(typeof body.clientStateUpdatedAt).toBe('number');
  });
});
