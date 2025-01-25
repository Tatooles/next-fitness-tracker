import { relations, sql } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
  sqliteView,
} from "drizzle-orm/sqlite-core";

export const workouts = sqliteTable("workouts", {
  id: integer("id").primaryKey(),
  userId: text("user_id", { length: 64 }),
  name: text("name", { length: 256 }).notNull(),
  date: text("date").notNull(),
});

export const workoutsRelations = relations(workouts, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey(),
  name: text("name", { length: 256 }).notNull(),
  notes: text("notes").notNull(),
  workoutId: integer("workout_id")
    .references(() => workouts.id, { onDelete: "cascade" })
    .notNull(),
});

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  sets: many(sets),
  workout: one(workouts, {
    fields: [exercises.workoutId],
    references: [workouts.id],
  }),
}));

export const exerciseView = sqliteView("exercise_view", {
  id: integer("id"),
  name: text("name"),
  notes: text("notes"),
  workoutId: integer("workout_id"),
  date: text("date"),
  userId: text("user_id"),
}).as(
  sql`
    SELECT 
      e.id AS id,
      e.name AS name,
      e.notes AS notes,
      e.workout_id AS workoutId,
      w.date AS date,
      w.user_id AS userId
    FROM exercises e
    JOIN workouts w ON e.workout_id = w.id
  `
);

export const sets = sqliteTable("sets", {
  id: integer("id").primaryKey(),
  reps: text("reps", { length: 16 }).notNull(),
  weight: text("weight", { length: 16 }).notNull(),
  exerciseId: integer("exercise_id")
    .references(() => exercises.id, { onDelete: "cascade" })
    .notNull(),
});

export const setsRelations = relations(sets, ({ one }) => ({
  exercise: one(exercises, {
    fields: [sets.exerciseId],
    references: [exercises.id],
  }),
}));
