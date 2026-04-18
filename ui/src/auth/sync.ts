import { apiFetch, ApiError } from 'src/api/client';
import { token, user, restoreSession, logout } from 'src/auth/state';
import {
  applyQuizSnapshotToLocal,
  collectQuizLocalSnapshot,
} from 'src/lib/localStorageSync';
import { setLocalMutationHandler } from 'src/lib/localMutationBus';

const DIRTY_KEY = 'nautiquiz-sync-dirty';

let syncTimer: ReturnType<typeof setTimeout> | null = null;
let syncInFlight: Promise<void> | null = null;
let syncQueued = false;
let initialized = false;

function markDirty() {
  localStorage.setItem(DIRTY_KEY, '1');
}

function clearDirty() {
  localStorage.removeItem(DIRTY_KEY);
}

function hasDirtyState() {
  return localStorage.getItem(DIRTY_KEY) === '1';
}

function canUseNetwork() {
  return typeof navigator === 'undefined' || navigator.onLine;
}

export function scheduleClientStateSync(delayMs = 400) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncTimer = null;
    void syncClientStateNow();
  }, delayMs);
}

export async function syncClientStateNow() {
  if (syncInFlight) {
    syncQueued = true;
    return syncInFlight;
  }

  syncInFlight = (async () => {
    if (!hasDirtyState() || !token.value || !canUseNetwork()) return;

    if (!user.value) {
      await restoreSession();
      if (!user.value || !token.value) return;
    }

    try {
      const snapshot = collectQuizLocalSnapshot();
      const res = await apiFetch<{ clientState: Record<string, unknown> }>(
        '/me/client-state',
        {
          method: 'PUT',
          body: JSON.stringify({ data: snapshot, merge: true }),
          token: token.value,
        },
      );
      applyQuizSnapshotToLocal(res.clientState);
      clearDirty();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
        clearDirty();
      } else {
        markDirty();
      }
    }
  })();

  try {
    await syncInFlight;
  } finally {
    syncInFlight = null;
    if (syncQueued) {
      syncQueued = false;
      scheduleClientStateSync(50);
    }
  }
}

export function initClientStateSync() {
  if (initialized) return;
  initialized = true;

  setLocalMutationHandler(() => {
    markDirty();
    scheduleClientStateSync();
  });

  window.addEventListener('online', () => {
    void syncClientStateNow();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      void syncClientStateNow();
    }
  });

  if (hasDirtyState()) {
    scheduleClientStateSync(50);
  }
}
