import { ref } from 'vue';
import { apiFetch, ApiError } from 'src/api/client';
import { fetchQuizLists } from 'src/api/quizLists';
import { fetchQuizHistories } from 'src/api/quizProgress';
import { buildImportAttemptsFromLocalStorage } from 'src/lib/buildImportAttempts';
import {
  applyServerHistoriesToLocal,
  applyServerQuizListsToLocal,
  hasLocalQuizData,
} from 'src/lib/localStorageSync';
import { reloadAllQuizFavsAndIssuesFromStorage } from 'src/utils';
import { pushQuizAttempts } from 'src/api/quizAttempts';
import {
  getQueuedQuizAttempts,
  removeQueuedQuizAttempts,
} from 'src/lib/quizAttemptQueue';
import { syncDataNow } from 'src/auth/sync';

const TOKEN_KEY = 'nautiquiz-token';
const USER_KEY = 'nautiquiz-user';

export function safeGetToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function safeSetToken(t: string | null) {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

function safeGetUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as Partial<AuthUser>;
    if (!o.id || typeof o.email !== 'string') return null;
    return {
      id: o.id,
      email: o.email,
      username: typeof o.username === 'string' ? o.username : null,
    };
  } catch {
    return null;
  }
}

function safeSetUser(next: AuthUser | null) {
  try {
    if (next) localStorage.setItem(USER_KEY, JSON.stringify(next));
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

export type AuthUser = { id: string; email: string; username: string | null };

type MeResponse = {
  user: AuthUser;
};

function importDismissedFor(userId: string): boolean {
  try {
    return localStorage.getItem(`nautiquiz-import-dismissed-${userId}`) === '1';
  } catch {
    return false;
  }
}

async function pullServerQuizData(token: string) {
  const [h, lists] = await Promise.all([
    fetchQuizHistories(token),
    fetchQuizLists(token),
  ]);
  applyServerHistoriesToLocal(h);
  applyServerQuizListsToLocal(lists);
  reloadAllQuizFavsAndIssuesFromStorage();
}

/** After login: pull server-only progress, or prompt to import browser data. */
async function reconcileQuizData(me: MeResponse, tokenStr: string) {
  if (!hasLocalQuizData()) {
    await pullServerQuizData(tokenStr);
    return;
  }
  if (importDismissedFor(me.user.id)) {
    await pullServerQuizData(tokenStr);
    return;
  }
  showImportDialog.value = true;
}

export const token = ref<string | null>(safeGetToken());
export const user = ref<AuthUser | null>(safeGetUser());
export const sessionReady = ref(false);
export const showImportDialog = ref(false);
/** Shared with MainLayout — open login/register from any page (e.g. classifiche). */
export const showAuthDialog = ref(false);

export async function restoreSession() {
  sessionReady.value = false;
  const t = safeGetToken();
  token.value = t;
  user.value = safeGetUser();
  if (!t) {
    sessionReady.value = true;
    return;
  }
  try {
    const data = await apiFetch<MeResponse>('/me', { token: t });
    user.value = data.user;
    safeSetUser(data.user);
    await reconcileQuizData(data, t);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      safeSetToken(null);
      safeSetUser(null);
      token.value = null;
      user.value = null;
    }
  } finally {
    sessionReady.value = true;
  }
}

export async function register(
  email: string,
  password: string,
  username: string,
) {
  const data = await apiFetch<{ token: string; user: AuthUser }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    },
  );
  safeSetToken(data.token);
  safeSetUser(data.user);
  token.value = data.token;
  user.value = data.user;
  const me = await apiFetch<MeResponse>('/me', { token: data.token });
  await reconcileQuizData(me, data.token);
}

export async function login(email: string, password: string) {
  const data = await apiFetch<{ token: string; user: AuthUser }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  );
  safeSetToken(data.token);
  safeSetUser(data.user);
  token.value = data.token;
  user.value = data.user;
  const me = await apiFetch<MeResponse>('/me', { token: data.token });
  await reconcileQuizData(me, data.token);
}

export async function setUsername(username: string) {
  const t = token.value;
  const prev = user.value;
  if (!t || !prev) throw new Error('Not logged in');
  const data = await apiFetch<{ user: { id: string; username: string | null } }>(
    '/me/username',
    {
      method: 'PUT',
      body: JSON.stringify({ username }),
      token: t,
    },
  );
  const next: AuthUser = {
    ...prev,
    id: data.user.id,
    username: data.user.username,
  };
  user.value = next;
  safeSetUser(next);
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string,
) {
  const t = token.value;
  if (!t) throw new Error('Not logged in');
  await apiFetch<{ ok: true }>('/me/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
    token: t,
  });
}

export function logout() {
  safeSetToken(null);
  safeSetUser(null);
  token.value = null;
  user.value = null;
}

export async function confirmImportLocalData() {
  const t = token.value;
  const u = user.value;
  if (!t || !u) return;
  const attempts = buildImportAttemptsFromLocalStorage();
  const chunkSize = 100;
  for (let i = 0; i < attempts.length; i += chunkSize) {
    await pushQuizAttempts(t, attempts.slice(i, i + chunkSize));
  }
  removeQueuedQuizAttempts(getQueuedQuizAttempts().map((row) => row.id));
  await syncDataNow();
  await pullServerQuizData(t);
  showImportDialog.value = false;
  try {
    localStorage.removeItem(`nautiquiz-import-dismissed-${u.id}`);
  } catch {
    /* ignore */
  }
  window.location.reload();
}

export async function dismissImportPrompt() {
  const u = user.value;
  if (u) {
    try {
      localStorage.setItem(`nautiquiz-import-dismissed-${u.id}`, '1');
    } catch {
      /* ignore */
    }
  }
  showImportDialog.value = false;
  const t = token.value;
  if (t) {
    try {
      await pullServerQuizData(t);
    } catch {
      /* offline or unauthorized — local progress stays until next sync */
    }
  }
}
