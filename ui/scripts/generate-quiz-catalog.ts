/**
 * Writes packages/quiz-catalog/src/correctAnswers.generated.json from live quiz definitions.
 * Run from repo root: bun run catalog:generate
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { QUIZZES, QUIZZES_5D, VELAQUIZZES } from '../src/data/quiz';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = join(
  __dirname,
  '../../packages/quiz-catalog/src/correctAnswers.generated.json',
);

function toMap(
  items: ReadonlyArray<{ id: number; answer: number }>,
): Record<string, number> {
  const o: Record<string, number> = {};
  for (const q of items) {
    o[String(q.id)] = q.answer;
  }
  return o;
}

const cart5d = toMap(QUIZZES_5D);

const payload = {
  base: toMap(QUIZZES),
  vela: toMap(VELAQUIZZES),
  '5d': cart5d,
  '42d': { ...cart5d },
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(payload)}\n`, 'utf8');
console.log(`Wrote ${outFile}`);
