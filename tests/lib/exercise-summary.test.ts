import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createRouteTestDatabase,
  destroyRouteTestDatabase,
  seedWorkout,
  type RouteTestDatabase,
} from "@/tests/support/route-test-db";

const { dbRef } = vi.hoisted(() => ({
  dbRef: {
    current: null as RouteTestDatabase["db"] | null,
  },
}));

vi.mock("@/db/drizzle", () => ({
  get db() {
    if (!dbRef.current) {
      throw new Error("Test database has not been initialized");
    }

    return dbRef.current;
  },
}));

import { getExerciseSummaryForUser } from "@/lib/exercise-summary";

describe("getExerciseSummaryForUser", () => {
  let database: RouteTestDatabase;

  beforeEach(async () => {
    database = await createRouteTestDatabase({
      includeSupersetGroupId: false,
    });
    dbRef.current = database.db;
  });

  afterEach(async () => {
    dbRef.current = null;
    await destroyRouteTestDatabase(database);
  });

  it("summarizes exercises without selecting superset-only columns", async () => {
    await seedWorkout(database, {
      userId: "user-1",
      date: "2026-04-01",
      name: "Push Day",
      exercises: [
        {
          name: "Bench Press",
          notes: "Top set",
          sets: [
            { weight: "225", reps: "5", rpe: "8" },
            { weight: "235", reps: "3", rpe: "9" },
          ],
        },
      ],
    });
    await seedWorkout(database, {
      userId: "user-2",
      date: "2026-04-02",
      name: "Other User",
      exercises: [
        {
          name: "Bench Press",
          notes: "Hidden",
          sets: [{ weight: "315", reps: "1", rpe: "10" }],
        },
      ],
    });

    await expect(getExerciseSummaryForUser("user-1")).resolves.toEqual([
      {
        name: "Bench Press",
        exercises: [
          expect.objectContaining({
            date: "2026-04-01",
            name: "Bench Press",
            notes: "Top set",
            sets: [
              expect.objectContaining({ weight: "225", reps: "5", rpe: "8" }),
              expect.objectContaining({ weight: "235", reps: "3", rpe: "9" }),
            ],
          }),
        ],
      },
    ]);
  });
});
