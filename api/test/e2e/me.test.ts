import { describe, expect, test } from 'bun:test';
import * as schema from '../../src/db/schema';
import { db } from '../../src/db';
import { signUserToken } from '../../src/lib/jwt';
import { hashPassword } from '../../src/lib/password';
import { apiFetch } from '../helpers/api';
import { uniqueUsername } from '../helpers/username';

function json(res: Response) {
  return res.json() as Promise<Record<string, unknown>>;
}

async function registerAndToken(): Promise<{
  token: string;
  email: string;
  username: string;
}> {
  const email = `me-${crypto.randomUUID()}@example.com`;
  const password = 'password123';
  const username = uniqueUsername();
  const res = await apiFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username }),
  });
  expect(res.status).toBe(200);
  const body = await json(res);
  return { token: body.token as string, email, username };
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
    const { token, email, username } = await registerAndToken();
    const res = await apiFetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.user).toEqual({ id: expect.any(String), email, username });
    expect(body.clientState).toEqual({});
    expect(typeof body.clientStateUpdatedAt).toBe('number');
  });

  test('200 GET /api/me and PUT /api/me/username when username is null (onboarding)', async () => {
    const id = crypto.randomUUID();
    const email = `onboard-${crypto.randomUUID()}@example.com`;
    const now = new Date();
    await db.insert(schema.users).values({
      id,
      email,
      username: null,
      passwordHash: hashPassword('password123'),
      createdAt: now,
    });
    await db.insert(schema.userClientState).values({
      userId: id,
      dataJson: '{}',
      updatedAt: now,
    });
    const token = await signUserToken(id);

    const me1 = await apiFetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(me1.status).toBe(200);
    const me1Body = await json(me1);
    expect((me1Body.user as { username: unknown }).username).toBeNull();

    const desired = uniqueUsername();
    const put = await apiFetch('/api/me/username', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: desired }),
    });
    expect(put.status).toBe(200);

    const me2 = await apiFetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(me2.status).toBe(200);
    const me2Body = await json(me2);
    expect(me2Body.user).toEqual({ id, email, username: desired });
  });
});
