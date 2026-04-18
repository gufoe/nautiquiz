/**
 * One-off: aggregates production "segnalazioni" (quiz-issues*) from SQLite user_client_state,
 * then emits a markdown report joined with local quiz copy. Re-fetch IDs:
 *   ssh gufoe 'docker exec nautiquiz-api-1 bun -e "..."'  # see README or runbook
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { QUIZZES, QUIZZES_5D, VELAQUIZZES } from '../src/data/quiz';
import type { QuizCarteggio, QuizInterface, QuizVelaInterface } from '../src/utils';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Snapshot from production (update with new SSH query). */
const USERS_SNAPSHOT = [
  {
    id: 'd41015d9-6b15-4d4c-a256-2695fe798f5e',
    'quiz-issues': [
      1074, 111, 639, 316, 841, 283, 1197, 614, 662, 737, 799, 752, 654, 898, 938, 420, 626, 280, 160, 1289, 586, 658, 40, 583, 653, 688, 1206, 199, 758, 742, 759, 744, 831, 599, 1181, 464, 300, 1386, 642, 1259, 696, 288, 161, 956, 1394,
    ],
    'vela-quiz-issues': [183, 23, 227, 204],
  },
  {
    id: '6fb9d2b5-9d5e-4586-83da-1cd31908ece4',
    'quiz-issues': [1301, 954, 639, 1061, 41, 1389, 654, 385, 1208, 488, 199, 1426],
    'vela-quiz-issues': [] as number[],
  },
] as const;

/** Production aggregate 2026-04-18 (gufoe /data/nautiquiz.sqlite, 2 users synced). */
const AGG = {
  'quiz-issues': [
    40, 41, 111, 160, 161, 199, 280, 283, 288, 300, 316, 385, 420, 464, 488, 583, 586, 599, 614, 626, 639, 642, 653, 654, 658, 662, 688, 696, 737, 742, 744, 752, 758, 759, 799, 831, 841, 898, 938, 954, 956, 1061, 1074, 1181, 1197, 1206, 1208, 1259, 1289, 1301, 1386, 1389, 1394, 1426,
  ],
  'vela-quiz-issues': [23, 183, 204, 227],
  '5d-quiz-issues': [] as number[],
  '42d-quiz-issues': [] as number[],
};

function esc(s: string) {
  return s.replace(/\r\n/g, '\n');
}

function mdBase(q: QuizInterface) {
  const lines: string[] = [];
  lines.push(`**Risposta indicata (indice):** ${q.answer} — ${q.choiches[q.answer] ?? '?'}`);
  lines.push('');
  lines.push('**Scelte:**');
  q.choiches.forEach((c, i) => {
    lines.push(`${i}. ${esc(c)}`);
  });
  if (q.description) {
    lines.push('');
    lines.push('**Spiegazione (app):**');
    lines.push('');
    lines.push(esc(q.description));
  }
  return lines.join('\n');
}

function mdVela(q: QuizVelaInterface) {
  const lines: string[] = [];
  lines.push(`**Risposta indicata:** ${q.answer === 1 ? 'Vero' : 'Falso'}`);
  if (q.description) {
    lines.push('');
    lines.push('**Spiegazione (app):**');
    lines.push('');
    lines.push(esc(q.description));
  }
  return lines.join('\n');
}

function mdCart(q: QuizCarteggio) {
  const lines: string[] = [];
  lines.push(`**Soluzione (app):** ${esc(q.solution)}`);
  if (q.description) {
    lines.push('');
    lines.push('**Note:**');
    lines.push('');
    lines.push(esc(q.description));
  }
  return lines.join('\n');
}

function byId<T extends { id: number }>(arr: T[], id: number): T | undefined {
  return arr.find((x) => x.id === id);
}

function section(title: string, ids: number[], body: (id: number) => string) {
  const out: string[] = [];
  out.push(`## ${title}`);
  out.push('');
  out.push(`*Domande segnalate (uniche, ordinate per id): **${ids.length}***`);
  out.push('');
  for (const id of [...ids].sort((a, b) => a - b)) {
    out.push(`### ID ${id}`);
    out.push('');
    out.push(body(id));
    out.push('');
  }
  return out.join('\n');
}

const repoRoot = join(__dirname, '..', '..');
const outPath = join(repoRoot, 'segnalazioni-da-risolvere.md');

const baseLines = section('Patente nautica (base)', AGG['quiz-issues'], (id) => {
  const q = byId(QUIZZES, id);
  if (!q) return '*ID non presente nel dataset locale `QUIZZES`.*';
  return [
    esc(q.question),
    '',
    q.image ? `*Figura:* \`${q.image}\`` : '*Senza figura.*',
    '',
    mdBase(q),
  ].join('\n');
});

const velaLines = section('Vela', AGG['vela-quiz-issues'], (id) => {
  const q = byId(VELAQUIZZES, id);
  if (!q) return '*ID non presente nel dataset locale `VELAQUIZZES`.*';
  return [esc(q.question), '', q.image ? `*Figura:* \`${q.image}\`` : '*Senza figura.*', '', mdVela(q)].join('\n');
});

const d5 = section('Carteggio entro 12 miglia (5d)', AGG['5d-quiz-issues'], (id) => {
  const q = byId(QUIZZES_5D, id);
  if (!q) return '*ID non presente nel dataset locale `QUIZZES_5D`.*';
  return [esc(q.question), '', mdCart(q)].join('\n');
});

const d42 = section('Carteggio oltre 12 miglia (42d)', AGG['42d-quiz-issues'], (id) => {
  const q = byId(QUIZZES_5D, id);
  if (!q) return '*ID non presente nel dataset locale `QUIZZES_5D`.*';
  return [esc(q.question), '', mdCart(q)].join('\n');
});

const userAppendix = [
  '## Dettaglio per utente (sync)',
  '',
  '| User ID | Base (`quiz-issues`) | Vela (`vela-quiz-issues`) |',
  '| --- | --- | --- |',
  ...USERS_SNAPSHOT.map(
    (u) =>
      `| \`${u.id}\` | ${u['quiz-issues'].length} id | ${u['vela-quiz-issues'].length} id |`,
  ),
  '',
  'Per elenco ID grezzi per utente, rieseguire la query sul server o aggiornare `USERS_SNAPSHOT` in `ui/scripts/gen-segnalazioni-md.ts`.',
  '',
].join('\n');

const md = [
  '# Segnalazioni — quiz da rivedere',
  '',
  'Elenco generato dai flag **Segnalazioni** (`quiz-issues` / `vela-quiz-issues` / …) salvati nel client state sincronizzato sul server di produzione.',
  '',
  '- **Origine dati:** SQLite `user_client_state.data_json` su host `gufoe`, volume Docker `nautiquiz_sqlite` → `/data/nautiquiz.sqlite`.',
  '- **Aggregazione:** unione di tutti gli ID segnalati da ogni utente (deduplicati).',
  '- **Dataset testi/risposte:** versione corrente del repo (`ui/src/data/quiz.ts`).',
  '- **Generato:** 2026-04-18.',
  '',
  userAppendix,
  '',
  '---',
  '',
  baseLines,
  '---',
  '',
  velaLines,
  '---',
  '',
  d5,
  '---',
  '',
  d42,
].join('\n');

writeFileSync(outPath, md, 'utf8');
console.error(`Wrote ${outPath}`);
