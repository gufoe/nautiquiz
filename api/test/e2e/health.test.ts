import { describe, expect, test } from 'bun:test';
import { apiFetch } from '../helpers/api';

describe('GET /health', () => {
  test('returns ok', async () => {
    const res = await apiFetch('/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
