CREATE INDEX IF NOT EXISTS `exercise_workout_name_idx` ON `exercise` (`workout_id`,`name`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `set_exercise_id_id_idx` ON `set` (`exercise_id`,`id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `workout_user_date_idx` ON `workout` (`user_id`,`date`);
