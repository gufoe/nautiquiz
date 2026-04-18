import { apiFetch } from 'src/api/client';
import type { QuizKind } from 'src/api/quizProgress';

export type QuizAttemptEvent = {
  id: string;
  quizKind: QuizKind;
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  answeredAt: number;
};

export async function pushQuizAttempts(
  token: string,
  attempts: QuizAttemptEvent[],
) {
  return apiFetch<{ ok: true; accepted: number }>('/quiz-attempts/batch', {
    method: 'POST',
    body: JSON.stringify({ attempts }),
    token,
  });
}

