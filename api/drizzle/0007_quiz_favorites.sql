CREATE TABLE `quiz_favorites` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`quiz_kind` text NOT NULL,
	`question_id` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `quiz_favorites_kind_qid_idx` ON `quiz_favorites` (`quiz_kind`, `question_id`);
CREATE INDEX `quiz_favorites_user_idx` ON `quiz_favorites` (`user_id`);
