import { apiFetch } from 'src/api/client';
import type { QuizKind } from 'src/api/quizProgress';

export type QuestionIdLists = Record<QuizKind, number[]>;

export type QuizListsResponse = {
  favorites: QuestionIdLists;
  issues: QuestionIdLists;
};

export async function fetchQuizLists(token: string) {
  return apiFetch<QuizListsResponse>('/quiz-lists', { token });
}

export async function putQuizLists(token: string, body: QuizListsResponse) {
  return apiFetch<{ ok: true }>('/quiz-lists', {
    method: 'PUT',
    body: JSON.stringify(body),
    token,
  });
}
