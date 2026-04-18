import { apiFetch } from 'src/api/client';
import {
  applyQuizSnapshotToLocal,
  collectQuizLocalSnapshot,
} from 'src/lib/localStorageSync';

/**
 * Uploads current local quiz snapshot and applies merged server state locally.
 * Single shared implementation for auth reconcile, manual import, and background sync.
 */
export async function pushLocalQuizSnapshot(token: string) {
  const snapshot = collectQuizLocalSnapshot();
  const res = await apiFetch<{ clientState: Record<string, unknown> }>(
    '/me/client-state',
    {
      method: 'PUT',
      body: JSON.stringify({ data: snapshot, merge: true }),
      token,
    },
  );
  applyQuizSnapshotToLocal(res.clientState);
  return res.clientState;
}

