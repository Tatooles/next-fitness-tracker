import {
  int,
  mysqlTable,
  serial,
  varchar,
  datetime,
  text,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const workouts = mysqlTable("workouts", {
  id: serial("id").primaryKey(),
  userId: int("userId"), // Double check type, int should be fine
  name: varchar("name", { length: 256 }),
  date: datetime("date"),
});

// TODO: Need something like this for the relational DB
export const workoutsRelations = relations(workouts, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercises = mysqlTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  notes: text("notes"),
  workoutId: int("workout_id").notNull(),
  // Need FK to workouts as well
});

// TODO: Should be like this
// export const postsRelations = relations(posts, ({ one, many }) => ({
//   author: one(users, {
//     fields: [posts.authorId],
//     references: [users.id],
//   }),
//   comments: many(comments),
// }));

export const exercisesRelations = relations(exercises, ({ one }) => ({
  author: one(workouts, {
    fields: [exercises.workoutId],
    references: [workouts.id],
  }),
}));

// Also one to many for exercises to sets

export const sets = mysqlTable("sets", {
  id: serial("id").primaryKey(),
  reps: varchar("reps", { length: 16 }),
  weight: varchar("weight", { length: 16 }),
  // Need FK to exercises as well
});
