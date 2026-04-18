CREATE TABLE `question_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`quiz_kind` text NOT NULL,
	`question_id` integer NOT NULL,
	`selected_answer` integer NOT NULL,
	`is_correct` integer,
	`answered_at` integer NOT NULL,
	`source` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

