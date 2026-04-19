/**
 * Rebuilds `answers` from authoritative `question_attempts` rows, or from an attached
 * backup DB that still has `question_attempts` (e.g. pre-0005 snapshot).
 *
 * Symptom fixed: all `answers` attributed to one user / impossible counts after a bad batch import,
 * while legacy `question_attempts` (or a file backup) still has correct `user_id` distribution.
 *
 * Usage (read-write on DB path):
 *   SQLITE_PATH=/data/nautiquiz.sqlite bun scripts/repair-answers-from-backup.ts
 *
 * If production already dropped `question_attempts`, pass a backup file:
 *   SQLITE_PATH=/data/nautiquiz.sqlite bun scripts/repair-answers-from-backup.ts --attach /tmp/nautiquiz.sqlite
 *
 * Dry run (no writes):
 *   SQLITE_PATH=... bun scripts/repair-answers-from-backup.ts --dry-run
 */
import { Database } from 'bun:sqlite';

const SQLITE_PATH = process.env.SQLITE_PATH ?? './data/nautiquiz.sqlite';
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const keepLegacy = args.includes('--keep-legacy-question-attempts');
const attachIdx = args.indexOf('--attach');
const attachPath =
  attachIdx >= 0 && args[attachIdx + 1] ? args[attachIdx + 1] : null;

function tableExists(db: Database, name: string): boolean {
  const row = db
    .query(
      "SELECT 1 as x FROM sqlite_master WHERE type='table' AND name=? LIMIT 1",
    )
    .get(name) as { x: number } | undefined;
  return !!row;
}

function countByUser(
  db: Database,
  table: 'answers' | 'question_attempts',
): { username: string | null; n: number }[] {
  return db
    .query(
      `
    SELECT u.username, COUNT(t.id) AS n
    FROM users u
    LEFT JOIN ${table} t ON t.user_id = u.id
    GROUP BY u.id
    ORDER BY n DESC
  `,
    )
    .all() as { username: string | null; n: number }[];
}

function rebuildFromQuestionAttempts(db: Database, sourceSql: string) {
  const insert = `
    INSERT INTO answers (id, user_id, quiz_kind, question_id, selected_answer, is_correct, answered_at)
    ${sourceSql}
  `;
  db.run('BEGIN IMMEDIATE');
  try {
    db.run('DELETE FROM answers');
    db.run(insert);
    if (!keepLegacy && tableExists(db, 'question_attempts')) {
      db.run('DROP TABLE question_attempts');
    }
    db.run('COMMIT');
  } catch (e) {
    db.run('ROLLBACK');
    throw e;
  }
}

const mainDb = new Database(SQLITE_PATH);

console.log('DB:', SQLITE_PATH);
console.log('Before answers by user:', JSON.stringify(countByUser(mainDb, 'answers'), null, 2));

const hasLocalQA = tableExists(mainDb, 'question_attempts');

if (hasLocalQA) {
  const n = mainDb.query('SELECT COUNT(*) as c FROM question_attempts').get() as {
    c: number;
  };
  console.log('Found question_attempts locally, rows:', n.c);
  console.log(
    'question_attempts by user:',
    JSON.stringify(countByUser(mainDb, 'question_attempts'), null, 2),
  );
  if (dryRun) {
    console.log('[dry-run] would DELETE answers and INSERT from question_attempts');
    mainDb.close();
    process.exit(0);
  }
  rebuildFromQuestionAttempts(
    mainDb,
    `SELECT id, user_id, quiz_kind, question_id, selected_answer,
      CASE WHEN is_correct IS NULL THEN 0 WHEN is_correct != 0 THEN 1 ELSE 0 END,
      answered_at
     FROM question_attempts`,
  );
} else if (attachPath) {
  console.log('No local question_attempts; attaching backup:', attachPath);
  const backup = new Database(attachPath, { readonly: true });
  if (!tableExists(backup, 'question_attempts')) {
    console.error('Backup has no question_attempts table; cannot repair.');
    backup.close();
    mainDb.close();
    process.exit(1);
  }
  const n = backup.query('SELECT COUNT(*) as c FROM question_attempts').get() as {
    c: number;
  };
  console.log('Backup question_attempts rows:', n.c);
  console.log(
    'question_attempts by user (backup):',
    JSON.stringify(countByUser(backup, 'question_attempts'), null, 2),
  );
  if (dryRun) {
    console.log('[dry-run] would DELETE answers and INSERT from attached backup');
    backup.close();
    mainDb.close();
    process.exit(0);
  }
  mainDb.run('BEGIN IMMEDIATE');
  try {
    mainDb.run('DELETE FROM answers');
    const stmt = mainDb.prepare(`
      INSERT INTO answers (id, user_id, quiz_kind, question_id, selected_answer, is_correct, answered_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const rows = backup
      .query(
        'SELECT id, user_id, quiz_kind, question_id, selected_answer, is_correct, answered_at FROM question_attempts',
      )
      .all() as {
      id: string;
      user_id: string;
      quiz_kind: string;
      question_id: number;
      selected_answer: number;
      is_correct: number | null;
      answered_at: number;
    }[];
    for (const r of rows) {
      const isCorrect =
        r.is_correct == null ? 0 : r.is_correct !== 0 ? 1 : 0;
      stmt.run(
        r.id,
        r.user_id,
        r.quiz_kind,
        r.question_id,
        r.selected_answer,
        isCorrect,
        r.answered_at,
      );
    }
    stmt.finalize();
    mainDb.run('COMMIT');
  } catch (e) {
    try {
      mainDb.run('ROLLBACK');
    } catch {
      /* ignore */
    }
    throw e;
  }
  backup.close();
} else {
  console.error(
    'No question_attempts in main DB and no --attach path. Example:\n' +
      '  SQLITE_PATH=/data/nautiquiz.sqlite bun scripts/repair-answers-from-backup.ts --attach /path/to/pre.sqlite',
  );
  mainDb.close();
  process.exit(1);
}

console.log('After answers by user:', JSON.stringify(countByUser(mainDb, 'answers'), null, 2));
const total = mainDb.query('SELECT COUNT(*) as c FROM answers').get() as { c: number };
console.log('Total answers rows:', total.c);
mainDb.close();
console.log('Done.');
