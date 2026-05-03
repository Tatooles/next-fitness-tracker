import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { exercise, set, workout } from "@/db/schema";
import type { RouteTestDatabase } from "@/tests/support/route-test-db";
import {
  setupRouteTestDatabase,
  teardownRouteTestDatabase,
} from "@/tests/support/route-handler-test";

import { GET } from "@/app/api/export/route";

describe("export route supersets", () => {
  let database: RouteTestDatabase;

  beforeEach(async () => {
    database = await setupRouteTestDatabase();
  });

  afterEach(async () => {
    await teardownRouteTestDatabase(database);
  });

  it("includes a Superset row before grouped exercises in csv exports", async () => {
    const [insertedWorkout] = await database.db
      .insert(workout)
      .values({
        userId: "user-1",
        date: "2026-04-18",
        name: "Push Day",
        notes: "",
        durationMinutes: 60,
      })
      .returning({ id: workout.id });

    const [benchExercise] = await database.db
      .insert(exercise)
      .values({
        workoutId: insertedWorkout.id,
        name: "Bench Press",
        notes: "",
        supersetGroupId: "superset-a",
      })
      .returning({ id: exercise.id });

    const [rowExercise] = await database.db
      .insert(exercise)
      .values({
        workoutId: insertedWorkout.id,
        name: "Chest Supported Row",
        notes: "",
        supersetGroupId: "superset-a",
      })
      .returning({ id: exercise.id });

    await database.db.insert(set).values([
      {
        exerciseId: benchExercise.id,
        weight: "225",
        reps: "5",
        rpe: "8",
      },
      {
        exerciseId: rowExercise.id,
        weight: "180",
        reps: "8",
        rpe: "8",
      },
    ]);

    const response = await GET(
      new NextRequest("http://localhost/api/export?fileType=csv"),
    );

    expect(response.status).toBe(200);
    const csvText = await response.text();

    expect(csvText).toContain("Push Day");
    expect(csvText).toContain("Superset");
    expect(csvText).toContain("Bench Press");
    expect(csvText).toContain("Chest Supported Row");
    expect(csvText.indexOf("Superset")).toBeLessThan(
      csvText.indexOf("Bench Press"),
    );
    expect(csvText.indexOf("Bench Press")).toBeLessThan(
      csvText.indexOf("Chest Supported Row"),
    );
    expect(csvText.match(/Superset/g)).toHaveLength(1);
  });
});
