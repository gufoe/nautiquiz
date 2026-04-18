import { apiFetch } from 'src/api/client';

export type QuizKind = 'base' | 'vela' | '5d' | '42d';

export type QuizProgressResponse = {
  quizKind: QuizKind;
  history: Record<string, number>;
};

export async function fetchQuizProgress(token: string, kind: QuizKind) {
  return apiFetch<QuizProgressResponse>(`/quiz-progress/${kind}`, { token });
}

