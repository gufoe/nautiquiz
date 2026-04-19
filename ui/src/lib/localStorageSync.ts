import { QUIZ_KINDS, type QuizKind } from '@nautiquiz/quiz-catalog';
import type { QuizListsResponse } from 'src/api/quizLists';
import { Storage } from 'src/utils';

const META_PREFIX = 'nautiquiz-';

/** localStorage keys for answer history (object maps question id → selected index). */
export const HISTORY_STORAGE_KEY_BY_KIND: Record<QuizKind, string> = {
  base: 'history',
  vela: 'vela-history',
  '5d': '5d-history',
  '42d': '42d-history',
};

/** Server payload from GET /quiz-histories — latest selected index per question id string. */
export type ServerQuizHistories = Record<QuizKind, Record<string, number>>;

const FAV_STORAGE_BY_KIND: Record<QuizKind, string> = {
  base: 'quiz-favs',
  vela: 'vela-quiz-favs',
  '5d': '5d-quiz-favs',
  '42d': '42d-quiz-favs',
};

const ISSUE_STORAGE_BY_KIND: Record<QuizKind, string> = {
  base: 'quiz-issues',
  vela: 'vela-quiz-issues',
  '5d': '5d-quiz-issues',
  '42d': '42d-quiz-issues',
};

function readNumberArrayFromStorage(key: string): number[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is number => typeof x === 'number' && Number.isInteger(x));
  } catch {
    return [];
  }
}

/** Current preferiti + segnalazioni from localStorage (for PUT /quiz-lists). */
export function collectFavAndIssueListsFromLocal(): QuizListsResponse {
  const favorites = {} as QuizListsResponse['favorites'];
  const issues = {} as QuizListsResponse['issues'];
  for (const kind of QUIZ_KINDS) {
    favorites[kind] = readNumberArrayFromStorage(FAV_STORAGE_BY_KIND[kind]);
    issues[kind] = readNumberArrayFromStorage(ISSUE_STORAGE_BY_KIND[kind]);
  }
  return { favorites, issues };
}

/** Apply server favorites/issues to localStorage and refresh in-memory refs (see utils reload). */
export function applyServerQuizListsToLocal(lists: QuizListsResponse) {
  for (const kind of QUIZ_KINDS) {
    Storage.set(FAV_STORAGE_BY_KIND[kind], lists.favorites[kind] ?? [], { notify: false });
    Storage.set(ISSUE_STORAGE_BY_KIND[kind], lists.issues[kind] ?? [], { notify: false });
  }
}

/** Overwrites local history keys from the server (used after login or import). */
export function applyServerHistoriesToLocal(histories: ServerQuizHistories) {
  for (const kind of QUIZ_KINDS) {
    const h = histories[kind];
    if (!h || typeof h !== 'object') continue;
    const key = HISTORY_STORAGE_KEY_BY_KIND[kind];
    const numeric: Record<number, number> = {};
    for (const [qid, sel] of Object.entries(h)) {
      const n = Number(qid);
      if (Number.isInteger(n) && typeof sel === 'number' && Number.isInteger(sel)) {
        numeric[n] = sel;
      }
    }
    Storage.set(key, numeric, { notify: false });
  }
}

/** Keys used by the quiz app (theme, progress, favorites, issues). */
export const QUIZ_STORAGE_KEYS = [
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

