import { ref } from 'vue';
import { QUIZ_KINDS, type QuizKind } from '@nautiquiz/quiz-catalog';
import { QUIZZES, QUIZZES_5D, VELAQUIZZES } from './data/quiz';
import { notifyLocalMutation } from './lib/localMutationBus';

export class Storage {
  static get<T>(name: string, def: () => T): T {
    const data = localStorage.getItem(name);
    if (!data) return def();
    return JSON.parse(data);
  }
  static set<T>(name: string, value: T, options?: { notify?: boolean }) {
    localStorage.setItem(name, JSON.stringify(value));
    if (options?.notify !== false) {
      notifyLocalMutation('attempt-queue');
    }
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
  description: string;
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

  reloadFromStorage() {
    this.favs.value = Storage.get<number[]>(this.storage_name, () => []);
  }
}

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
  getQuizStats(history?: QuizHistory<Y>) {
    const h = history ?? this.getQuizHistory();
    return {
      total: this.quizzes.length,
      completed: Object.values(h).length,
      correct: this.quizzes.filter((q) => this.isCorrect(q, h[q.id])).length,
    };
  }
  getQuizzes(mode: QuizMode, history?: QuizHistory<Y>) {
    const h = history ?? this.getQuizHistory();
    const modes: Record<QuizMode, (q: T) => boolean> = {
      all: () => true,
      missing: (q) => !(q.id in h),
      favs: (q) => this.favs.includes(q.id),
      issues: (q) => this.issues.includes(q.id),
      mistakes: (q) => q.id in h && !this.isCorrect(q, h[q.id]),
    };
    return this.quizzes.filter((q) => modes[mode](q));
  }

  /** After server merge into localStorage — refresh Vue refs for favs/issues. */
  reloadFavsAndIssuesFromStorage() {
    this.favs.reloadFromStorage();
    this.issues.reloadFromStorage();
  }
}

const BASE_QUIZ = new Quiz('', QUIZZES);
const VELA_QUIZ = new Quiz('vela-', VELAQUIZZES);
const CARTEGGIO_5D_QUIZ = new Quiz('5d-', QUIZZES_5D);
const CARTEGGIO_42D_QUIZ = new Quiz('42d-', QUIZZES_5D);

export function getQuiz(name: QuizKind) {
  return {
    base: BASE_QUIZ,
    vela: VELA_QUIZ,
    '5d': CARTEGGIO_5D_QUIZ,
    '42d': CARTEGGIO_42D_QUIZ,
  }[name];
}

/** Call after applyServerQuizListsToLocal so UI reflects merged preferiti/segnalazioni. */
export function reloadAllQuizFavsAndIssuesFromStorage() {
  for (const name of QUIZ_KINDS) {
    getQuiz(name).reloadFavsAndIssuesFromStorage();
  }
}

export function shuffle<T>(array: T[]) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}
