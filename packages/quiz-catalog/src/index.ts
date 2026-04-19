/**
 * Compact question-id → correct answer index maps, generated from `ui/src/data/quiz.ts`.
 * Run `bun run catalog:generate` from the repo root after editing quiz data.
 */
import maps from './correctAnswers.generated.json';

/** All supported quiz families — single source for API, UI, and scripts. */
export const QUIZ_KINDS = ['base', 'vela', '5d', '42d'] as const;
export type QuizKind = (typeof QUIZ_KINDS)[number];

export function isQuizKind(value: unknown): value is QuizKind {
  return (
    typeof value === 'string' &&
    (QUIZ_KINDS as readonly string[]).includes(value)
  );
}

export type CorrectAnswerMaps = Record<
  QuizKind,
  Record<string, number>
>;

const DATA = maps as CorrectAnswerMaps;

export function getCorrectAnswerIndex(
  kind: QuizKind,
  questionId: number,
): number | undefined {
  const row = DATA[kind];
  if (!row) return undefined;
  const v = row[String(questionId)];
  return typeof v === 'number' && Number.isInteger(v) ? v : undefined;
}

export function isAnswerCorrect(
  kind: QuizKind,
  questionId: number,
  selectedAnswer: number,
): boolean {
  const expected = getCorrectAnswerIndex(kind, questionId);
  if (expected === undefined) return false;
  return expected === selectedAnswer;
}
