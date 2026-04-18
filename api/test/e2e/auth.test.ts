import { describe, expect, test } from 'bun:test';
import { apiFetch } from '../helpers/api';

function json(res: Response) {
  return res.json() as Promise<Record<string, unknown>>;
}

describe('POST /api/auth/register', () => {
  test('creates user and returns token', async () => {
    const email = `reg-${crypto.randomUUID()}@example.com`;
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' }),
    });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(typeof body.token).toBe('string');
    expect(body.user).toEqual({ id: expect.any(String), email });
  });

  test('400 when email or password missing', async () => {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.co' }),
    });
    expect(res.status).toBe(400);
    expect(await json(res)).toEqual({
      error: 'Email and password are required',
    });
  });

  test('400 when email invalid', async () => {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-email', password: 'password123' }),
    });
    expect(res.status).toBe(400);
    expect(await json(res)).toEqual({ error: 'Invalid email' });
  });

  test('400 when password too short', async () => {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'x@y.co', password: 'short' }),
    });
    expect(res.status).toBe(400);
    expect(await json(res)).toEqual({
      error: 'Password must be at least 8 characters',
    });
  });

  test('409 when email already registered', async () => {
    const email = `dup-${crypto.randomUUID()}@example.com`;
    const ok = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' }),
    });
    expect(ok.status).toBe(200);

    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password45678' }),
    });
    expect(res.status).toBe(409);
    expect(await json(res)).toEqual({ error: 'Email already registered' });
  });
});

describe('POST /api/auth/login', () => {
  test('returns token for valid credentials', async () => {
    const email = `login-${crypto.randomUUID()}@example.com`;
    const password = 'password123';
    await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    expect(res.status).toBe(200);
    const body = await json(res);
    expect(typeof body.token).toBe('string');
    expect(body.user).toEqual({ id: expect.any(String), email });
  });

  test('400 when email or password missing', async () => {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.co' }),
    });
    expect(res.status).toBe(400);
    expect(await json(res)).toEqual({
      error: 'Email and password are required',
    });
  });

  test('401 when password wrong', async () => {
    const email = `badpw-${crypto.randomUUID()}@example.com`;
    await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' }),
    });

    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'wrongpass1' }),
    });
    expect(res.status).toBe(401);
    expect(await json(res)).toEqual({ error: 'Invalid email or password' });
  });

  test('401 when user does not exist', async () => {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `nope-${crypto.randomUUID()}@example.com`,
        password: 'password123',
      }),
    });
    expect(res.status).toBe(401);
    expect(await json(res)).toEqual({ error: 'Invalid email or password' });
  });
});
