import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  /** Lowercase unique public handle; null until the user completes onboarding. */
  username: text('username').unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

export const userClientState = sqliteTable('user_client_state', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  /** JSON object: localStorage key -> parsed value */
  dataJson: text('data_json').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
});

export const quizSessions = sqliteTable('quiz_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  mode: text('mode').notNull(),
  answered: integer('answered').notNull(),
  correct: integer('correct').notNull(),
  score: integer('score').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

export const questionAttempts = sqliteTable('question_attempts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  /** Quiz family the question belongs to: base, vela, 5d, 42d. */
  quizKind: text('quiz_kind').notNull(),
  questionId: integer('question_id').notNull(),
  selectedAnswer: integer('selected_answer').notNull(),
  /** Nullable for imported legacy rows where correctness is unknown. */
  isCorrect: integer('is_correct', { mode: 'boolean' }),
  /** Event time in epoch milliseconds. */
  answeredAt: integer('answered_at', { mode: 'timestamp_ms' }).notNull(),
  /**
   * Source marker for lineage/debugging:
   * - "live" from current session submissions
   * - "legacy" imported from historical client-state maps
   */
  source: text('source').notNull(),
});
