import { ref } from 'vue';
import { apiFetch, ApiError } from 'src/api/client';
import {
  hasLocalQuizData,
  isEmptyClientState,
  replaceQuizSnapshotToLocal,
} from 'src/lib/localStorageSync';
import { pushLocalQuizSnapshot } from 'src/auth/clientStateRemote';

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
  clientState: Record<string, unknown>;
  clientStateUpdatedAt: number;
};

export const token = ref<string | null>(safeGetToken());
export const user = ref<AuthUser | null>(safeGetUser());
export const sessionReady = ref(false);
export const showImportDialog = ref(false);
/** Shared with MainLayout — open login/register from any page (e.g. classifiche). */
export const showAuthDialog = ref(false);

async function reconcileClientState(
  me: MeResponse,
  t: string,
  options: { preferLocalMerge: boolean },
) {
  const hasLocalData = hasLocalQuizData();
  const hasRemoteData = !isEmptyClientState(me.clientState);

  if (!hasLocalData && hasRemoteData) {
    replaceQuizSnapshotToLocal(me.clientState);
    return;
  }

  if (!hasLocalData) {
    return;
  }

  if (options.preferLocalMerge) {
    await pushLocalQuizSnapshot(t);
    return;
  }

  if (hasRemoteData) {
    replaceQuizSnapshotToLocal(me.clientState);
    return;
  }

  await pushLocalQuizSnapshot(t);
}

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
    await reconcileClientState(data, t, { preferLocalMerge: false });
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
  await reconcileClientState(me, data.token, { preferLocalMerge: true });
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
  await reconcileClientState(me, data.token, { preferLocalMerge: true });
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
  await pushLocalQuizSnapshot(t);
  showImportDialog.value = false;
  localStorage.removeItem(`nautiquiz-import-dismissed-${u.id}`);
  window.location.reload();
}

export function dismissImportPrompt() {
  const u = user.value;
  if (u) {
    localStorage.setItem(`nautiquiz-import-dismissed-${u.id}`, '1');
  }
  showImportDialog.value = false;
}
