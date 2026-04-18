import server from '../../src/index';

const base = 'http://127.0.0.1';

/** Calls the API default fetch (Hono) with a path-relative URL. */
export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return await server.fetch(new Request(new URL(path, base), init));
}
