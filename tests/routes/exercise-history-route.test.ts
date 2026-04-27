import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  createRouteTestDatabase,
  destroyRouteTestDatabase,
  seedWorkout,
  type RouteTestDatabase,
} from "@/tests/support/route-test-db";

const { authMock, authState, dbRef } = vi.hoisted(() => ({
  authMock: vi.fn(),
  authState: {
    userId: null as string | null,
  },
  dbRef: {
    current: null as RouteTestDatabase["db"] | null,
  },
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: authMock,
}));

vi.mock("@/db/drizzle", () => ({
  get db() {
    if (!dbRef.current) {
      throw new Error("Test database has not been initialized");
    }

    return dbRef.current;
  },
}));

import { GET } from "@/app/api/exercises/history/route";

describe("GET /api/exercises/history", () => {
  let database: RouteTestDatabase;

  beforeEach(async () => {
    database = await createRouteTestDatabase({
      includeSupersetGroupId: false,
    });
    dbRef.current = database.db;
    authState.userId = "user-1";
    authMock.mockImplementation(async () => ({ userId: authState.userId }));
  });

  afterEach(async () => {
    dbRef.current = null;
    authState.userId = null;
    await destroyRouteTestDatabase(database);
  });

  it("returns 401 for unauthenticated requests", async () => {
    authState.userId = null;

    const response = await GET(
      new NextRequest(
        "http://localhost/api/exercises/history?name=Bench%20Press",
      ),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("returns 400 when the exercise name is missing", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/exercises/history"),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Exercise name is required",
    });
  });

  it("returns grouped history ordered by workout date and excludes other users", async () => {
    await seedWorkout(database, {
      userId: "user-1",
      date: "2026-04-04",
      name: "Push Day",
      exercises: [
        {
          name: "Bench Press",
          notes: "Top set moved fast",
          sets: [
            { weight: "225", reps: "5", rpe: "8" },
            { weight: "235", reps: "3", rpe: "9" },
          ],
        },
      ],
    });

    await seedWorkout(database, {
      userId: "user-1",
      date: "2026-04-01",
      name: "Upper Volume",
      exercises: [
        {
          name: "Bench Press",
          notes: "Long pause",
          sets: [{ weight: "205", reps: "8", rpe: "7.5" }],
        },
      ],
    });

    await seedWorkout(database, {
      userId: "user-2",
      date: "2026-04-05",
      name: "Other User Workout",
      exercises: [
        {
          name: "Bench Press",
          notes: "Should not leak",
          sets: [{ weight: "315", reps: "2", rpe: "9.5" }],
        },
      ],
    });

    await seedWorkout(database, {
      userId: "user-1",
      date: "2026-04-03",
      name: "Leg Day",
      exercises: [
        {
          name: "Squat",
          notes: "Different movement",
          sets: [{ weight: "315", reps: "5", rpe: "8" }],
        },
      ],
    });

    const response = await GET(
      new NextRequest(
        "http://localhost/api/exercises/history?name=Bench%20Press",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([
      {
        date: "2026-04-04",
        notes: "Top set moved fast",
        workoutId: 1,
        workoutName: "Push Day",
        sets: [
          expect.objectContaining({ weight: "225", reps: "5", rpe: "8" }),
          expect.objectContaining({ weight: "235", reps: "3", rpe: "9" }),
        ],
      },
      {
        date: "2026-04-01",
        notes: "Long pause",
        workoutId: 2,
        workoutName: "Upper Volume",
        sets: [
          expect.objectContaining({ weight: "205", reps: "8", rpe: "7.5" }),
        ],
      },
    ]);
  });
});
