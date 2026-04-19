-- Single quiz data table: answers (user / question / answer / timestamp + correctness for stats).
-- Migrates from question_attempts and drops redundant tables.

CREATE TABLE `answers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`quiz_kind` text NOT NULL,
	`question_id` integer NOT NULL,
	`selected_answer` integer NOT NULL,
	`is_correct` integer NOT NULL,
	`answered_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

INSERT INTO `answers` (`id`, `user_id`, `quiz_kind`, `question_id`, `selected_answer`, `is_correct`, `answered_at`)
SELECT
	`id`,
	`user_id`,
	`quiz_kind`,
	`question_id`,
	`selected_answer`,
	CASE WHEN `is_correct` IS NULL THEN 0 WHEN `is_correct` != 0 THEN 1 ELSE 0 END,
	`answered_at`
FROM `question_attempts`;

DROP TABLE `question_attempts`;
DROP TABLE `quiz_sessions`;
DROP TABLE `user_client_state`;
