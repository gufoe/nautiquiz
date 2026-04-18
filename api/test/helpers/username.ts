/** Valid lowercase username for tests (3–24 chars, [a-z0-9_]). */
export function uniqueUsername(): string {
  return `u${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
}
