import { isAnswerCorrect, QUIZ_KINDS } from '@nautiquiz/quiz-catalog';
import type { QuizAttemptEvent } from 'src/api/quizAttempts';
import { HISTORY_STORAGE_KEY_BY_KIND } from 'src/lib/localStorageSync';

/** Builds server upload rows from localStorage history maps (one event per stored answer). */
export function buildImportAttemptsFromLocalStorage(): QuizAttemptEvent[] {
  const out: QuizAttemptEvent[] = [];
  const now = Date.now();
  for (const kind of QUIZ_KINDS) {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY_BY_KIND[kind]);
    if (!raw) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!parsed || typeof parsed !== 'object') continue;
    for (const [qidStr, selRaw] of Object.entries(parsed as Record<string, unknown>)) {
      const questionId = Number(qidStr);
      const selected = Number(selRaw);
      if (!Number.isInteger(questionId) || !Number.isInteger(selected)) continue;
      out.push({
        id: crypto.randomUUID(),
        quizKind: kind,
        questionId,
        selectedAnswer: selected,
        isCorrect: isAnswerCorrect(kind, questionId, selected),
        answeredAt: now,
      });
    }
  }
  return out;
}
