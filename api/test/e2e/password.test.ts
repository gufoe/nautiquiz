import { describe, expect, test } from 'bun:test';
import { apiFetch } from '../helpers/api';
import { uniqueUsername } from '../helpers/username';

function json(res: Response) {
  return res.json() as Promise<Record<string, unknown>>;
}

describe('PUT /api/me/password', () => {
  test('401 without token', async () => {
    const res = await apiFetch('/api/me/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: 'a',
        newPassword: 'bbbbbbbb',
      }),
    });
    expect(res.status).toBe(401);
  });

  test('401 when current password wrong', async () => {
    const email = `pw-${crypto.randomUUID()}@example.com`;
    const password = 'password123';
    const username = uniqueUsername();
    const reg = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });
    const { token } = await json(reg);

    const res = await apiFetch('/api/me/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: 'wrongpassword',
        newPassword: 'newpass12345',
      }),
    });
    expect(res.status).toBe(401);
  });

  test('200 updates password and new password works on login', async () => {
    const email = `pw2-${crypto.randomUUID()}@example.com`;
    const oldPw = 'password123';
    const newPw = 'newpassword456';
    const username = uniqueUsername();

    const reg = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: oldPw, username }),
    });
    const { token } = await json(reg);

    const ch = await apiFetch('/api/me/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: oldPw,
        newPassword: newPw,
      }),
    });
    expect(ch.status).toBe(200);

    const loginOld = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: oldPw }),
    });
    expect(loginOld.status).toBe(401);

    const loginNew = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: newPw }),
    });
    expect(loginNew.status).toBe(200);
  });
});
