import { apiFetch } from 'src/api/client';

export type { QuizKind } from '@nautiquiz/quiz-catalog';
export { QUIZ_KINDS, isQuizKind } from '@nautiquiz/quiz-catalog';

export type QuizProgressResponse = {
  quizKind: QuizKind;
  history: Record<string, number>;
};

export async function fetchQuizProgress(token: string, kind: QuizKind) {
  return apiFetch<QuizProgressResponse>(`/quiz-progress/${kind}`, { token });
}

export type QuizHistoriesResponse = Record<
  QuizKind,
  Record<string, number>
>;

export async function fetchQuizHistories(token: string) {
  return apiFetch<QuizHistoriesResponse>('/quiz-histories', { token });
}

