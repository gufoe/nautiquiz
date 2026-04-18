import { ref } from 'vue';
import { apiFetch, ApiError } from 'src/api/client';
import {
  applyQuizSnapshotToLocal,
  collectQuizLocalSnapshot,
  hasLocalQuizData,
  isEmptyClientState,
} from 'src/lib/localStorageSync';

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
    return raw ? (JSON.parse(raw) as AuthUser) : null;
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

export type AuthUser = { id: string; email: string };

type MeResponse = {
  user: AuthUser;
  clientState: Record<string, unknown>;
  clientStateUpdatedAt: number;
};

export const token = ref<string | null>(safeGetToken());
export const user = ref<AuthUser | null>(safeGetUser());
export const sessionReady = ref(false);
export const showImportDialog = ref(false);

async function reconcileClientState(me: MeResponse, t: string) {
  const hasLocalData = hasLocalQuizData();
  const hasRemoteData = !isEmptyClientState(me.clientState);

  if (!hasLocalData && hasRemoteData) {
    applyQuizSnapshotToLocal(me.clientState);
    return;
  }

  if (hasLocalData) {
    const snapshot = collectQuizLocalSnapshot();
    const res = await apiFetch<{ clientState: Record<string, unknown> }>(
      '/me/client-state',
      {
        method: 'PUT',
        body: JSON.stringify({ data: snapshot, merge: true }),
        token: t,
      },
    );
    applyQuizSnapshotToLocal(res.clientState);
  }
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
    await reconcileClientState(data, t);
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

export async function register(email: string, password: string) {
  const data = await apiFetch<{ token: string; user: AuthUser }>(
    '/auth/register',
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
  await reconcileClientState(me, data.token);
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
  await reconcileClientState(me, data.token);
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
  const snapshot = collectQuizLocalSnapshot();
  const res = await apiFetch<{ clientState: Record<string, unknown> }>(
    '/me/client-state',
    {
      method: 'PUT',
      body: JSON.stringify({ data: snapshot, merge: true }),
      token: t,
    },
  );
  applyQuizSnapshotToLocal(res.clientState);
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
