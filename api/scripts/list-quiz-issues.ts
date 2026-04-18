/**
 * Lists quiz "segnalazioni" (reported question IDs) from synced client state.
 *
 * Run inside the API container (production DB path):
 *   bun /app/scripts/list-quiz-issues.ts
 *   bun /app/scripts/list-quiz-issues.ts --json
 *
 * Local (dev SQLite):
 *   SQLITE_PATH=./data/nautiquiz.sqlite bun scripts/list-quiz-issues.ts
 */
import { existsSync } from 'node:fs';
import { Database } from 'bun:sqlite';

const ISSUE_KEYS = [
  'quiz-issues',
  'vela-quiz-issues',
  '5d-quiz-issues',
  '42d-quiz-issues',
] as const;

type IssueKey = (typeof ISSUE_KEYS)[number];

const LABEL: Record<IssueKey, string> = {
  'quiz-issues': 'base (patente nautica)',
  'vela-quiz-issues': 'vela',
  '5d-quiz-issues': 'carteggio entro 12 miglia (5d)',
  '42d-quiz-issues': 'carteggio oltre 12 miglia (42d)',
};

function sortNums(a: number, b: number) {
  return a - b;
}

function parseDataJson(dataJson: string): Record<string, unknown> | null {
  try {
    return JSON.parse(dataJson) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function numsFromValue(v: unknown): number[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is number => typeof x === 'number');
}

const sqlitePath = process.env.SQLITE_PATH ?? '/data/nautiquiz.sqlite';
const jsonOnly = process.argv.includes('--json');

if (!existsSync(sqlitePath)) {
  console.error(`SQLite file not found: ${sqlitePath}`);
  console.error('Set SQLITE_PATH or run inside the API container where /data/nautiquiz.sqlite exists.');
  process.exit(1);
}

const db = new Database(sqlitePath, { readonly: true, create: false });

type Row = { user_id: string; data_json: string };
let rows: Row[];
try {
  rows = db.query('SELECT user_id, data_json FROM user_client_state').all() as Row[];
} catch (e) {
  console.error(`Failed to read ${sqlitePath}:`, e);
  process.exit(1);
}

const aggregated: Record<IssueKey, Set<number>> = {
  'quiz-issues': new Set(),
  'vela-quiz-issues': new Set(),
  '5d-quiz-issues': new Set(),
  '42d-quiz-issues': new Set(),
};

const perUser: {
  userId: string;
  byKey: Record<IssueKey, number[]>;
}[] = [];

for (const { user_id: userId, data_json } of rows) {
  const data = parseDataJson(data_json);
  const byKey = {
    'quiz-issues': [] as number[],
    'vela-quiz-issues': [] as number[],
    '5d-quiz-issues': [] as number[],
    '42d-quiz-issues': [] as number[],
  };
  if (data) {
    for (const k of ISSUE_KEYS) {
      const n = numsFromValue(data[k]);
      byKey[k] = n;
      for (const x of n) aggregated[k].add(x);
    }
  }
  perUser.push({ userId, byKey });
}

const payload = {
  generatedAt: new Date().toISOString(),
  sqlitePath,
  userClientStateRows: rows.length,
  labels: LABEL,
  aggregated: Object.fromEntries(
    ISSUE_KEYS.map((k) => [k, [...aggregated[k]].sort(sortNums)]),
  ),
  perUser: perUser.map((u) => ({
    userId: u.userId,
    byKey: u.byKey,
  })),
};

if (jsonOnly) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const lines: string[] = [];
lines.push('Nautiquiz — quiz segnalazioni (issue IDs segnalati dagli utenti)');
lines.push(`Database: ${sqlitePath}`);
lines.push(`Righe user_client_state: ${rows.length}`);
lines.push(`Generato: ${payload.generatedAt}`);
lines.push('');
lines.push('=== ID aggregati (unici, tutti gli utenti) ===');
lines.push('');
for (const k of ISSUE_KEYS) {
  const ids = [...aggregated[k]].sort(sortNums);
  lines.push(`${LABEL[k]} [${k}]: ${ids.length} id`);
  lines.push(ids.length ? ids.join(', ') : '(nessuno)');
  lines.push('');
}
lines.push('=== Dettaglio per utente ===');
lines.push('');
for (const u of perUser) {
  lines.push(`user_id: ${u.userId}`);
  for (const k of ISSUE_KEYS) {
    const ids = [...u.byKey[k]].sort(sortNums);
    lines.push(`  ${LABEL[k]}: ${ids.length} → ${ids.join(', ') || '(nessuno)'}`);
  }
  lines.push('');
}
lines.push('Uscita JSON: aggiungi --json (es. bun scripts/list-quiz-issues.ts --json)');

console.log(lines.join('\n'));
