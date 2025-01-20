import { eq, relations } from "drizzle-orm";
import { QueryBuilder } from "drizzle-orm/mysql-core";
import {
  text,
  integer,
  sqliteTable,
  sqliteView,
} from "drizzle-orm/sqlite-core";

export const workouts = sqliteTable("workouts", {
  id: integer("id").primaryKey(),
  userId: text("userId", { length: 64 }),
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
  workoutId: integer("workout_id").notNull(),
});

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  sets: many(sets),
  workout: one(workouts, {
    fields: [exercises.workoutId],
    references: [workouts.id],
  }),
}));

const qb = new QueryBuilder();

export const exerciseView = sqliteView("exercise_view").as((qb) =>
  qb
    .select({
      id: exercises.id,
      name: exercises.name,
      notes: exercises.notes,
      date: workouts.date,
      user_id: workouts.userId,
    })
    .from(exercises)
    .innerJoin(workouts, eq(workouts.id, exercises.workoutId))
);

export const sets = sqliteTable("sets", {
  id: integer("id").primaryKey(),
  reps: text("reps", { length: 16 }).notNull(),
  weight: text("weight", { length: 16 }).notNull(),
  exerciseId: integer("exercise_id").notNull(),
});

export const setsRelations = relations(sets, ({ one }) => ({
  exercise: one(exercises, {
    fields: [sets.exerciseId],
    references: [exercises.id],
  }),
}));
