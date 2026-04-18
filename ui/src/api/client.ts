/** Base URL for the API origin (empty = same origin + dev proxy to `/api`). */
function apiRoot(): string {
  const raw = import.meta.env.VITE_API_BASE;
  const base =
    typeof raw === 'string' && raw.length > 0 ? raw.replace(/\/$/, '') : '';
  return base ? `${base}/api` : '/api';
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, ...rest } = init;
  const headers = new Headers(rest.headers);
  if (!headers.has('Content-Type') && rest.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const url = `${apiRoot()}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, { ...rest, headers });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const err = data as { error?: string } | null;
    const msg = err?.error ?? res.statusText ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}
