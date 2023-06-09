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
  userId: varchar("userId", { length: 64 }),
  name: varchar("name", { length: 256 }).notNull(),
  date: datetime("date").notNull(),
});

export const workoutsRelations = relations(workouts, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercises = mysqlTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  notes: text("notes").notNull(),
  workoutId: int("workout_id").notNull(),
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
  reps: varchar("reps", { length: 16 }).notNull(),
  weight: varchar("weight", { length: 16 }).notNull(),
  exerciseId: int("exercise_id").notNull(),
});

export const setsRelations = relations(sets, ({ one }) => ({
  exercise: one(exercises, {
    fields: [sets.exerciseId],
    references: [exercises.id],
  }),
}));
