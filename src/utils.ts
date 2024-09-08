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

export type QuizMode = 'all' | 'missing' | 'mistakes' | 'favs' | 'issues';

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

export class StoredQuestions {
  private readonly favs;

  constructor(private storage_name: string) {
    this.favs = ref(Storage.get<number[]>(this.storage_name, () => []));
  }

  includes(quiz_id: number) {
    return this.favs.value.includes(quiz_id);
  }

  toggle(quiz_id: number) {
    const i = this.favs.value.indexOf(quiz_id);
    if (i < 0) {
      this.favs.value.push(quiz_id);
    } else {
      this.favs.value.splice(i, 1);
    }
    Storage.set(this.storage_name, this.favs.value);
  }

  get length() {
    return this.favs.value.length;
  }
}

export const QUIZ_FAVS = new StoredQuestions('quiz-favs');
export const QUIZ_ISSUES = new StoredQuestions('quiz-issues');
