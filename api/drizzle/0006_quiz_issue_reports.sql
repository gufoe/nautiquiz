CREATE TABLE `quiz_issue_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`quiz_kind` text NOT NULL,
	`question_id` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE INDEX `quiz_issue_reports_kind_qid_idx` ON `quiz_issue_reports` (`quiz_kind`, `question_id`);
CREATE INDEX `quiz_issue_reports_user_idx` ON `quiz_issue_reports` (`user_id`);
