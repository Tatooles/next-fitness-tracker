import {
  int,
  mysqlTable,
  serial,
  varchar,
  datetime,
  text,
} from "drizzle-orm/mysql-core";
import { InferModel } from "drizzle-orm";

export const workouts = mysqlTable("workouts", {
  id: serial("id").primaryKey(),
  userId: int("userId"), // Double check type, int should be fine
  name: varchar("name", { length: 256 }),
  date: datetime("date"),
});

export type Workout = InferModel<typeof workouts>;

export const exercises = mysqlTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  notes: text("notes"),
  // Need FK to workouts as well
});

export type Exercise = InferModel<typeof exercises>;

export const sets = mysqlTable("sets", {
  id: serial("id").primaryKey(),
  reps: varchar("reps", { length: 16 }),
  weight: varchar("weight", { length: 16 }),
  // Need FK to exercises as well
});

export type Set = InferModel<typeof sets>;
