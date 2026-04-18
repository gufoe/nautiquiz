import { describe, expect, test } from 'bun:test';
import { apiFetch } from '../helpers/api';

function json(res: Response) {
  return res.json() as Promise<Record<string, unknown>>;
}

async function registerToken(): Promise<string> {
  const email = `cs-${crypto.randomUUID()}@example.com`;
  const res = await apiFetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123' }),
  });
  expect(res.status).toBe(200);
  const body = await json(res);
  return body.token as string;
}

describe('PUT /api/me/client-state', () => {
  test('401 without Authorization', async () => {
    const res = await apiFetch('/api/me/client-state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { a: 1 } }),
    });
    expect(res.status).toBe(401);
    expect(await json(res)).toEqual({ error: 'Unauthorized' });
  });

  test('400 when body.data is missing or not an object', async () => {
    const token = await registerToken();
    const res = await apiFetch('/api/me/client-state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    expect(await json(res)).toEqual({ error: 'Expected { data: object }' });
  });

  test('replaces client state when merge is false', async () => {
    const token = await registerToken();
    await apiFetch('/api/me/client-state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: { theme: 'dark', score: 1 } }),
    });
    const put = await apiFetch('/api/me/client-state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: { level: 2 }, merge: false }),
    });
    expect(put.status).toBe(200);
    const putBody = await json(put);
    expect(putBody.ok).toBe(true);
    expect(putBody.clientState).toEqual({ level: 2 });

    const me = await apiFetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(me.status).toBe(200);
    const meBody = await json(me);
    expect(meBody.clientState).toEqual({ level: 2 });
  });

  test('merges with existing state by default', async () => {
    const token = await registerToken();
    await apiFetch('/api/me/client-state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: { a: 1 } }),
    });
    const res = await apiFetch('/api/me/client-state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: { b: 2 } }),
    });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.clientState).toEqual({ a: 1, b: 2 });
  });

  test('deep-merges nested history objects and unions arrays', async () => {
    const token = await registerToken();
    await apiFetch('/api/me/client-state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          history: { 1: 0, 2: 1 },
          'quiz-favs': [7, 8],
        },
      }),
    });

    const res = await apiFetch('/api/me/client-state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          history: { 3: 1 },
          'quiz-favs': [8, 9],
        },
      }),
    });

    expect(res.status).toBe(200);
    const body = await json(res);
    expect(body.clientState).toEqual({
      history: { 1: 0, 2: 1, 3: 1 },
      'quiz-favs': [7, 8, 9],
    });
  });
});
