-- Legacy tables from migrations 0000–0001. Migration 0005 already issued DROPs; some DBs
-- still retained these rows. Safe to re-run: IF EXISTS.
-- Split required: SQLite prepare() runs only the first statement per segment (see drizzle #393).
DROP TABLE IF EXISTS `quiz_sessions`;
--> statement-breakpoint
DROP TABLE IF EXISTS `user_client_state`;
