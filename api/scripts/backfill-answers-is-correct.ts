/**
 * Recomputes `answers.is_correct` from the shared quiz catalog (same source as the UI).
 *
 *   SQLITE_PATH=./data/nautiquiz.sqlite bun scripts/backfill-answers-is-correct.ts
 */
import { eq } from 'drizzle-orm';
import { isAnswerCorrect, isQuizKind } from '@nautiquiz/quiz-catalog';
import { db, sqlite } from '../src/db';
import { answers } from '../src/db/schema';

const rows = await db.select().from(answers);
let updated = 0;
for (const row of rows) {
  if (!isQuizKind(row.quizKind)) continue;
  const expected = isAnswerCorrect(
    row.quizKind,
    row.questionId,
    row.selectedAnswer,
  );
  if (expected !== row.isCorrect) {
    await db
      .update(answers)
      .set({ isCorrect: expected })
      .where(eq(answers.id, row.id));
    updated++;
  }
}

sqlite.close();
console.log(`Checked ${rows.length} answer row(s); updated ${updated}.`);
