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
  userId: varchar("userId", { length: 256 }), // Length probably too long, could be changed
  name: varchar("name", { length: 256 }),
  date: datetime("date"),
});

export const workoutsRelations = relations(workouts, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercises = mysqlTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  notes: text("notes"),
  workoutId: int("workout_id").notNull(),
  // TODO: Probably add userId here too for future data/trend queries
});

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  sets: many(sets),
  workout: one(workouts, {
    fields: [exercises.workoutId],
    references: [workouts.id],
  }),
}));

export const sets = mysqlTable("sets", {
  id: serial("id").primaryKey(),
  reps: varchar("reps", { length: 16 }),
  weight: varchar("weight", { length: 16 }),
  exerciseId: int("exercise_id").notNull(),
});

export const setsRelations = relations(sets, ({ one }) => ({
  exercise: one(exercises, {
    fields: [sets.exerciseId],
    references: [exercises.id],
  }),
}));
