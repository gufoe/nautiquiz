import { ref } from 'vue';
import { QUIZZES } from './data/quiz';

export class Storage {
  static get<T>(name: string, def: () => T): T {
    const data = localStorage.getItem(name);
    if (!data) return def();
    return JSON.parse(data);
  }
  static set<T>(name: string, value: T) {
    localStorage.setItem(name, JSON.stringify(value));
  }
}

export type QuizHistory = Record<number, number>;

export interface QuizInterface {
  id: number;
  question: string;
  description?: string;
  answer: number;
  choiches: string[];
  image?: string;
}

export type QuizMode = 'all' | 'missing' | 'mistakes' | 'favs';

export function getQuizHistory(): QuizHistory {
  return Storage.get<QuizHistory>('history', () => ({}));
}
export function getQuizStats() {
  const h = getQuizHistory();
  return {
    total: QUIZZES.length,
    completed: Object.values(h).length,
    correct: QUIZZES.filter((q) => h[q.id] === q.answer).length,
  };
}

export const QUIZ_FAVS = ref(Storage.get<number[]>('quiz-favs', () => []));

export function isQuizFav(quiz_id: number) {
  return QUIZ_FAVS.value.includes(quiz_id);
}

export function toggleQuizFav(quiz_id: number) {
  const i = QUIZ_FAVS.value.indexOf(quiz_id);
  if (i < 0) {
    QUIZ_FAVS.value.push(quiz_id);
  } else {
    QUIZ_FAVS.value.splice(i, 1);
  }
  Storage.set('quiz-favs', QUIZ_FAVS.value);
}
