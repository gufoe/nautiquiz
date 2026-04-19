import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  /** Lowercase unique public handle; null until the user completes onboarding. */
  username: text('username').unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

/**
 * One row per answered question event: user, question (quiz_kind + question_id), chosen index,
 * whether it matches the catalog, and when it happened.
 */
export const answers = sqliteTable('answers', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  quizKind: text('quiz_kind').notNull(),
  questionId: integer('question_id').notNull(),
  selectedAnswer: integer('selected_answer').notNull(),
  isCorrect: integer('is_correct', { mode: 'boolean' }).notNull(),
  answeredAt: integer('answered_at', { mode: 'timestamp_ms' }).notNull(),
});

/**
 * Segnalazioni: one row per (user, quiz family, question) while the user has that question flagged.
 * Replaced in full on each client sync so the table matches browser state for analysis.
 */
export const quizIssueReports = sqliteTable('quiz_issue_reports', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  quizKind: text('quiz_kind').notNull(),
  questionId: integer('question_id').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

/** Preferiti: same shape as segnalazioni — full replace on each client sync. */
export const quizFavorites = sqliteTable('quiz_favorites', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  quizKind: text('quiz_kind').notNull(),
  questionId: integer('question_id').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});
