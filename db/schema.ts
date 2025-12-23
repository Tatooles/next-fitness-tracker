import { relations, sql } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
  sqliteView,
  real,
} from "drizzle-orm/sqlite-core";

export const workout = sqliteTable("workout", {
  id: integer("id").primaryKey(),
  userId: text("user_id", { length: 64 }),
  name: text("name", { length: 256 }).notNull(),
  date: text("date").notNull(),
});

export const workoutRelations = relations(workout, ({ many }) => ({
  exercises: many(exercise),
}));

export const exercise = sqliteTable("exercise", {
  id: integer("id").primaryKey(),
  name: text("name", { length: 256 }).notNull(),
  notes: text("notes").notNull(),
  workoutId: integer("workout_id")
    .references(() => workout.id, { onDelete: "cascade" })
    .notNull(),
});

export const exerciseRelations = relations(exercise, ({ one, many }) => ({
  sets: many(set),
  workout: one(workout, {
    fields: [exercise.workoutId],
    references: [workout.id],
  }),
}));

// TODO: Probably need to rewrite this because it only works the first time
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
      e.workout_id AS workout_id,
      w.date AS date,
      w.user_id AS user_id
    FROM exercise e
    JOIN workout w ON e.workout_id = w.id
  `,
);

export const set = sqliteTable("set", {
  id: integer("id").primaryKey(),
  reps: text("reps", { length: 16 }).notNull(),
  weight: text("weight", { length: 16 }).notNull(),
  rpe: text("rpe", { length: 16 }).notNull().default(""),
  exerciseId: integer("exercise_id")
    .references(() => exercise.id, { onDelete: "cascade" })
    .notNull(),
});

export const setRelations = relations(set, ({ one }) => ({
  exercise: one(exercise, {
    fields: [set.exerciseId],
    references: [exercise.id],
  }),
}));
