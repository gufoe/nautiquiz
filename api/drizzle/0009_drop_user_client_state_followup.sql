-- Follow-up if an older 0008 only executed its first segment (see drizzle issue 393).
-- Idempotent; no-op when the table is already gone.
DROP TABLE IF EXISTS `user_client_state`;
