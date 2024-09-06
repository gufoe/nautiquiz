import { QUIZZES } from './data/quiz';

export class Storage {
  static get<T>(name: string): T | undefined {
    const data = localStorage.getItem(name);
    if (!data) return undefined;
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

export type QuizMode = 'all' | 'missing' | 'mistakes';

function getQuizHistory(): QuizHistory {
  return Storage.get<QuizHistory>('history') ?? {};
}
export function getQuizStats() {
  const h = getQuizHistory();
  return {
    total: QUIZZES.length,
    completed: Object.values(h).length,
    correct: QUIZZES.filter((q) => h[q.id] === q.answer).length,
  };
}
