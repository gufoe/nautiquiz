import type { QuizAttemptEvent } from 'src/api/quizAttempts';
import { notifyLocalMutation } from 'src/lib/localMutationBus';

const QUEUE_KEY = 'nautiquiz-quiz-attempt-queue-v1';

function readQueue(): QuizAttemptEvent[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QuizAttemptEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(next: QuizAttemptEvent[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(next));
}

export function enqueueQuizAttempt(event: Omit<QuizAttemptEvent, 'id'>) {
  const row: QuizAttemptEvent = {
    ...event,
    id: crypto.randomUUID(),
  };
  const queue = readQueue();
  queue.push(row);
  writeQueue(queue);
  notifyLocalMutation('attempt-queue');
}

export function getQueuedQuizAttempts(limit?: number): QuizAttemptEvent[] {
  const queue = readQueue();
  return typeof limit === 'number' ? queue.slice(0, limit) : queue;
}

export function removeQueuedQuizAttempts(ids: string[]) {
  if (ids.length === 0) return;
  const idSet = new Set(ids);
  const next = readQueue().filter((row) => !idSet.has(row.id));
  writeQueue(next);
}

export function hasQueuedQuizAttempts() {
  return getQueuedQuizAttempts(1).length > 0;
}

