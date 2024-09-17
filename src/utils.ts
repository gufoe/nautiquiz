import { ref } from 'vue';
import { QUIZZES, QUIZZES_5D, VELAQUIZZES } from './data/quiz';

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

export type QuizHistory<T> = Record<number, T>;

export interface QuizBase {
  id: number;
  answer?: number;
  image?: string;
  question: string;
  description?: string;
  solution?: string;
}
export interface QuizInterface extends QuizBase {
  choiches: string[];
  answer: number;
}
export interface QuizVelaInterface extends QuizBase {
  answer: 0 | 1;
}
export interface QuizCarteggio extends QuizBase {
  answer: 1;
  solution: string;
}

export type QuizMode = 'all' | 'missing' | 'mistakes' | 'favs' | 'issues';

export class Quiz<T extends QuizBase, Y> {
  public favs;
  public issues;
  constructor(
    public prefix: string,
    public quizzes: T[],
    public isCorrect: (question: T, answer: Y) => boolean = (q, a) =>
      q.answer === a,
  ) {
    this.favs = new StoredQuestions(this.prefix + 'quiz-favs');
    this.issues = new StoredQuestions(this.prefix + 'quiz-issues');
  }
  getQuizHistory() {
    return Storage.get<QuizHistory<Y>>(this.prefix + 'history', () => ({}));
  }
  setQuizHistory(history: QuizHistory<Y>) {
    return Storage.set(this.prefix + 'history', history);
  }
  getQuizStats() {
    const h = this.getQuizHistory();
    return {
      total: this.quizzes.length,
      completed: Object.values(h).length,
      correct: this.quizzes.filter((q) => this.isCorrect(q, h[q.id])).length,
    };
  }
  getQuizzes(mode: QuizMode) {
    const h = this.getQuizHistory();
    const modes: Record<QuizMode, (q: T) => boolean> = {
      all: () => true,
      // all: (q) => !!q.image,
      missing: (q) => !(q.id in h),
      favs: (q) => this.favs.includes(q.id),
      issues: (q) => this.issues.includes(q.id),
      mistakes: (q) => q.id in h && !this.isCorrect(q, h[q.id]),
    };
    return this.quizzes.filter((q) => modes[mode](q));
  }
}

export function getQuiz(name: 'base' | 'vela' | '5d' | '42d') {
  return {
    base: BASE_QUIZ,
    vela: VELA_QUIZ,
    '5d': CARTEGGIO_5D_QUIZ,
    '42d': CARTEGGIO_42D_QUIZ,
  }[name];
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

const BASE_QUIZ = new Quiz('', QUIZZES);
const VELA_QUIZ = new Quiz('vela-', VELAQUIZZES);
const CARTEGGIO_5D_QUIZ = new Quiz('5d-', QUIZZES_5D);
const CARTEGGIO_42D_QUIZ = new Quiz('42d-', QUIZZES_5D);
