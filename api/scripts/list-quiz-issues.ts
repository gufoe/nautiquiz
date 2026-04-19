/**
 * Lists segnalazioni (quiz_issue_reports) and preferiti (quiz_favorites) for analysis.
 *
 * Run inside the API container:
 *   bun /app/scripts/list-quiz-issues.ts
 *   bun /app/scripts/list-quiz-issues.ts --json
 *
 * Local:
 *   SQLITE_PATH=./data/nautiquiz.sqlite bun scripts/list-quiz-issues.ts
 */
import { existsSync } from 'node:fs';
import { Database } from 'bun:sqlite';

const sqlitePath = process.env.SQLITE_PATH ?? '/data/nautiquiz.sqlite';
const jsonOnly = process.argv.includes('--json');

if (!existsSync(sqlitePath)) {
  console.error(`SQLite file not found: ${sqlitePath}`);
  process.exit(1);
}

const db = new Database(sqlitePath, { readonly: true, create: false });

type IssueRow = {
  user_id: string;
  quiz_kind: string;
  question_id: number;
  updated_at: number;
};

const issues = db
  .query(
    'SELECT user_id, quiz_kind, question_id, updated_at FROM quiz_issue_reports ORDER BY quiz_kind, question_id, user_id',
  )
  .all() as IssueRow[];

const favs = db
  .query(
    'SELECT user_id, quiz_kind, question_id, updated_at FROM quiz_favorites ORDER BY quiz_kind, question_id, user_id',
  )
  .all() as IssueRow[];

const payload = {
  generatedAt: new Date().toISOString(),
  sqlitePath,
  issueReportCount: issues.length,
  favoriteCount: favs.length,
  issues,
  favorites: favs,
};

if (jsonOnly) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

console.log('Nautiquiz — segnalazioni e preferiti (tabelle server)');
console.log(`Database: ${sqlitePath}`);
console.log(`Righe quiz_issue_reports: ${issues.length}`);
console.log(`Righe quiz_favorites: ${favs.length}`);
console.log(`Generato: ${payload.generatedAt}`);
console.log('');
console.log('Uscita JSON: aggiungi --json');
