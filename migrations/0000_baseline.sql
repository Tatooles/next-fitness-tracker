CREATE TABLE IF NOT EXISTS `workout` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text(64),
	`name` text(256) NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`duration_minutes` integer,
	`date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `exercise` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(256) NOT NULL,
	`notes` text NOT NULL,
	`workout_id` integer NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workout`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `set` (
	`id` integer PRIMARY KEY NOT NULL,
	`reps` text(16) NOT NULL,
	`weight` text(16) NOT NULL,
	`rpe` text(16) DEFAULT '' NOT NULL,
	`exercise_id` integer NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE cascade
);
