import { ApiError } from 'src/api/client';
import { pushQuizAttempts } from 'src/api/quizAttempts';
import { pushLocalQuizSnapshot } from 'src/auth/clientStateRemote';
import { token, user, restoreSession, logout } from 'src/auth/state';
import { setLocalMutationHandler } from 'src/lib/localMutationBus';
import {
  getQueuedQuizAttempts,
  hasQueuedQuizAttempts,
  removeQueuedQuizAttempts,
} from 'src/lib/quizAttemptQueue';

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

function hasSyncWork() {
  return hasDirtyState() || hasQueuedQuizAttempts();
}

function canUseNetwork() {
  return typeof navigator === 'undefined' || navigator.onLine;
}

export function scheduleDataSync(delayMs = 400) {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncTimer = null;
    void syncDataNow();
  }, delayMs);
}

export async function syncDataNow() {
  if (syncInFlight) {
    syncQueued = true;
    return syncInFlight;
  }

  syncInFlight = (async () => {
    if (!hasSyncWork() || !token.value || !canUseNetwork()) return;

    if (!user.value) {
      await restoreSession();
      if (!user.value || !token.value) return;
    }

    try {
      while (token.value && hasQueuedQuizAttempts()) {
        const chunk = getQueuedQuizAttempts(100);
        if (chunk.length === 0) break;
        await pushQuizAttempts(token.value, chunk);
        removeQueuedQuizAttempts(chunk.map((row) => row.id));
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
        return;
      }
      // Keep queue as-is and retry on next trigger/network recovery.
      return;
    }

    try {
      if (!hasDirtyState()) return;
      await pushLocalQuizSnapshot(token.value);
      clearDirty();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        logout();
      } else {
        /* Includes 403 (username required) until onboarding completes */
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
      scheduleDataSync(50);
    }
  }
}

export function initDataSync() {
  if (initialized) return;
  initialized = true;

  setLocalMutationHandler(({ channel }) => {
    if (channel === 'client-state') {
      markDirty();
    }
    scheduleDataSync();
  });

  window.addEventListener('online', () => {
    void syncDataNow();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      void syncDataNow();
    }
  });

  if (hasSyncWork()) {
    scheduleDataSync(50);
  }
}

/** Backward-compatible aliases used by existing imports. */
export const scheduleClientStateSync = scheduleDataSync;
export const syncClientStateNow = syncDataNow;
export const initClientStateSync = initDataSync;
