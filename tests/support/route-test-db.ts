import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";

export interface SeedWorkoutInput {
  userId: string;
  date?: string;
  name?: string;
  notes?: string;
  durationMinutes?: number | null;
  exercises?: {
    name: string;
    notes?: string;
    supersetGroupId?: string | null;
    sets?: {
      reps: string;
      weight: string;
      rpe?: string;
    }[];
  }[];
}

export interface RouteTestDatabase {
  client: Client;
  db: LibSQLDatabase<typeof schema>;
  filePath: string;
}

export async function createRouteTestDatabase(): Promise<RouteTestDatabase> {
  const filePath = path.join(
    os.tmpdir(),
    `next-fitness-tracker-route-test-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}.db`,
  );
  const client = createClient({
    url: `file:${filePath}`,
  });

  await client.execute("PRAGMA foreign_keys = ON");
  await client.execute(`
    CREATE TABLE workout (
      id INTEGER PRIMARY KEY,
      user_id TEXT,
      name TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      duration_minutes INTEGER,
      date TEXT NOT NULL
    )
  `);
  await client.execute(`
    CREATE TABLE exercise (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      notes TEXT NOT NULL,
      superset_group_id TEXT,
      workout_id INTEGER NOT NULL REFERENCES workout(id) ON DELETE CASCADE
    )
  `);
  await client.execute(`
    CREATE TABLE "set" (
      id INTEGER PRIMARY KEY,
      reps TEXT NOT NULL,
      weight TEXT NOT NULL,
      rpe TEXT NOT NULL DEFAULT '',
      exercise_id INTEGER NOT NULL REFERENCES exercise(id) ON DELETE CASCADE
    )
  `);
  await client.execute(
    "CREATE INDEX workout_user_date_idx ON workout(user_id, date)",
  );
  await client.execute(
    "CREATE INDEX exercise_workout_name_idx ON exercise(workout_id, name)",
  );
  await client.execute(
    'CREATE INDEX set_exercise_id_id_idx ON "set"(exercise_id, id)',
  );

  return {
    client,
    db: drizzle(client, { schema }),
    filePath,
  };
}

export async function destroyRouteTestDatabase(
  database: RouteTestDatabase,
): Promise<void> {
  const closableClient = database.client as Client & {
    close?: () => Promise<void> | void;
  };

  await closableClient.close?.();
  await fs.rm(database.filePath, { force: true });
}

export async function seedWorkout(
  database: RouteTestDatabase,
  input: SeedWorkoutInput,
): Promise<number> {
  const [insertedWorkout] = await database.db
    .insert(schema.workout)
    .values({
      userId: input.userId,
      date: input.date ?? "2026-04-01",
      durationMinutes: input.durationMinutes ?? 45,
      name: input.name ?? "Seed Workout",
      notes: input.notes ?? "Seed notes",
    })
    .returning({ id: schema.workout.id });

  for (const exerciseInput of input.exercises ?? []) {
    const [insertedExercise] = await database.db
      .insert(schema.exercise)
      .values({
        workoutId: insertedWorkout.id,
        name: exerciseInput.name,
        notes: exerciseInput.notes ?? "",
        supersetGroupId: exerciseInput.supersetGroupId ?? null,
      })
      .returning({ id: schema.exercise.id });

    if (exerciseInput.sets?.length) {
      await database.db.insert(schema.set).values(
        exerciseInput.sets.map((setInput) => ({
          exerciseId: insertedExercise.id,
          reps: setInput.reps,
          weight: setInput.weight,
          rpe: setInput.rpe ?? "",
        })),
      );
    }
  }

  return insertedWorkout.id;
}
