import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
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
