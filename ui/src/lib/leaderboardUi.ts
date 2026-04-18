/**
 * API `accuracy` is the fraction of answers that were correct (0–1).
 * (Server: correctCount / correctKnown — total answered for sessions, or graded attempts otherwise.)
 */
export function leaderboardCorrectPercent(accuracy: number): number {
  const a = Number.isFinite(accuracy) ? Math.max(0, Math.min(1, accuracy)) : 0;
  return Math.round(a * 100);
}

/** Quasar text-* classes: green ≥80%, orange ≥70%, else red. */
export function leaderboardCorrectPercentClass(accuracy: number): string {
  const a = Number.isFinite(accuracy) ? accuracy : 0;
  if (a >= 0.8) return 'text-positive';
  if (a >= 0.7) return 'text-warning';
  return 'text-negative';
}
