import { Storage } from 'src/utils';

const META_PREFIX = 'nautiquiz-';

/** Keys used by the quiz app (theme, progress, favorites, issues). */
export const QUIZ_STORAGE_KEYS = [
  'theme-dark',
  'history',
  'quiz-favs',
  'quiz-issues',
  'vela-history',
  'vela-quiz-favs',
  'vela-quiz-issues',
  '5d-history',
  '5d-quiz-favs',
  '5d-quiz-issues',
  '42d-history',
  '42d-quiz-favs',
  '42d-quiz-issues',
] as const;

function isMetaKey(key: string): boolean {
  return key.startsWith(META_PREFIX);
}

/** Snapshot of app data keys (excludes nautiquiz-* auth/meta keys). */
export function collectQuizLocalSnapshot(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of QUIZ_STORAGE_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw == null) continue;
    try {
      out[key] = JSON.parse(raw) as unknown;
    } catch {
      out[key] = raw;
    }
  }
  return out;
}

export function hasLocalQuizData(): boolean {
  return Object.keys(collectQuizLocalSnapshot()).length > 0;
}

export function applyQuizSnapshotToLocal(data: Record<string, unknown>) {
  for (const [key, value] of Object.entries(data)) {
    if (isMetaKey(key)) continue;
    if (QUIZ_STORAGE_KEYS.includes(key as (typeof QUIZ_STORAGE_KEYS)[number])) {
      Storage.set(key, value, { notify: false });
    }
  }
}

export function replaceQuizSnapshotToLocal(data: Record<string, unknown>) {
  for (const key of QUIZ_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
  applyQuizSnapshotToLocal(data);
}

export function isEmptyClientState(state: Record<string, unknown> | null | undefined) {
  return !state || Object.keys(state).length === 0;
}
