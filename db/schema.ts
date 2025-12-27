import { relations } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

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
