import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { count, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { exercise, set, workout } from "@/db/schema";
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

import { POST } from "@/app/api/workouts/route";
import { PATCH, DELETE } from "@/app/api/workouts/[id]/route";

describe("workout route handlers", () => {
  let database: RouteTestDatabase;

  beforeEach(async () => {
    database = await createRouteTestDatabase();
    dbRef.current = database.db;
    authState.userId = "user-1";
    authMock.mockImplementation(async () => ({ userId: authState.userId }));
  });

  afterEach(async () => {
    dbRef.current = null;
    authState.userId = null;
    await destroyRouteTestDatabase(database);
  });

  describe("POST /api/workouts", () => {
    it("creates a workout tree for the authenticated user", async () => {
      const response = await POST(
        createJsonRequest("http://localhost/api/workouts", "POST", {
          date: "2026-04-02",
          name: "Push Day",
          notes: "Strong session",
          durationMinutes: 70,
          exercises: [
            {
              name: "Bench Press",
              notes: "Felt good",
              sets: [
                { weight: "225", reps: "5", rpe: "8" },
                { weight: "235", reps: "3", rpe: "9" },
              ],
            },
            {
              name: "Overhead Press",
              notes: "",
              sets: [{ weight: "135", reps: "5", rpe: "8" }],
            },
          ],
        }),
      );

      expect(response.status).toBe(201);
      await expect(response.json()).resolves.toMatchObject({
        message: "Workout created",
        workoutId: expect.any(Number),
      });

      const workouts = await database.db.query.workout.findMany({
        with: {
          exercises: {
            with: {
              sets: {
                orderBy: (setsTable, { asc }) => [asc(setsTable.id)],
              },
            },
          },
        },
      });

      expect(workouts).toHaveLength(1);
      expect(workouts[0]).toMatchObject({
        userId: "user-1",
        name: "Push Day",
        notes: "Strong session",
        durationMinutes: 70,
        date: "2026-04-02",
      });
      expect(workouts[0].exercises).toHaveLength(2);
      expect(workouts[0].exercises[0]).toMatchObject({
        name: "Bench Press",
        notes: "Felt good",
      });
      expect(workouts[0].exercises[0].sets).toHaveLength(2);
      expect(workouts[0].exercises[1]).toMatchObject({
        name: "Overhead Press",
      });
    });

    it("returns 401 for unauthenticated create requests", async () => {
      authState.userId = null;

      const response = await POST(
        createJsonRequest("http://localhost/api/workouts", "POST", validPayload()),
      );

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
      await expect(getCounts(database)).resolves.toEqual({
        workouts: 0,
        exercises: 0,
        sets: 0,
      });
    });

    it("returns 400 for invalid payloads without writing rows", async () => {
      const response = await POST(
        createJsonRequest("http://localhost/api/workouts", "POST", {
          ...validPayload(),
          name: "",
        }),
      );

      expect(response.status).toBe(400);
      await expect(getCounts(database)).resolves.toEqual({
        workouts: 0,
        exercises: 0,
        sets: 0,
      });
    });

    it("returns 400 for malformed JSON", async () => {
      const response = await POST(
        new NextRequest("http://localhost/api/workouts", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: "{",
        }),
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        error: "Invalid JSON body",
      });
    });
  });

  describe("PATCH /api/workouts/:id", () => {
    it("updates an owned workout transactionally", async () => {
      const workoutId = await seedWorkout(database, {
        userId: "user-1",
        name: "Old Workout",
        notes: "Old notes",
        exercises: [
          {
            name: "Squat",
            notes: "Heavy",
            sets: [{ weight: "315", reps: "5", rpe: "8" }],
          },
          {
            name: "Leg Press",
            notes: "",
            sets: [{ weight: "500", reps: "10", rpe: "9" }],
          },
        ],
      });

      const response = await PATCH(
        createJsonRequest(
          `http://localhost/api/workouts/${workoutId}`,
          "PATCH",
          {
            date: "2026-04-03",
            name: "Updated Workout",
            notes: "New notes",
            durationMinutes: 55,
            exercises: [
              {
                name: "Deadlift",
                notes: "Top single",
                sets: [{ weight: "405", reps: "1", rpe: "8.5" }],
              },
            ],
          },
        ),
        routeParams(workoutId),
      );

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({
        message: "Workout updated",
      });

      const updatedWorkout = await database.db.query.workout.findFirst({
        where: eq(workout.id, workoutId),
        with: {
          exercises: {
            with: {
              sets: true,
            },
          },
        },
      });

      expect(updatedWorkout).toMatchObject({
        id: workoutId,
        userId: "user-1",
        name: "Updated Workout",
        notes: "New notes",
        durationMinutes: 55,
        date: "2026-04-03",
      });
      expect(updatedWorkout?.exercises).toHaveLength(1);
      expect(updatedWorkout?.exercises[0]).toMatchObject({
        name: "Deadlift",
        notes: "Top single",
      });
      expect(updatedWorkout?.exercises[0].sets).toHaveLength(1);
      expect(updatedWorkout?.exercises[0].sets[0]).toMatchObject({
        weight: "405",
        reps: "1",
        rpe: "8.5",
      });
    });

    it("returns 401 for unauthenticated update requests", async () => {
      const workoutId = await seedWorkout(database, {
        userId: "user-1",
        exercises: [],
      });
      authState.userId = null;

      const response = await PATCH(
        createJsonRequest(
          `http://localhost/api/workouts/${workoutId}`,
          "PATCH",
          validPayload(),
        ),
        routeParams(workoutId),
      );

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    });

    it("returns 400 for invalid workout IDs", async () => {
      const response = await PATCH(
        createJsonRequest(
          "http://localhost/api/workouts/not-a-number",
          "PATCH",
          validPayload(),
        ),
        routeParams("not-a-number"),
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        error: "Invalid workout id",
      });
    });

    it("returns 400 for invalid update payloads", async () => {
      const workoutId = await seedWorkout(database, {
        userId: "user-1",
        exercises: [],
      });

      const response = await PATCH(
        createJsonRequest(
          `http://localhost/api/workouts/${workoutId}`,
          "PATCH",
          { ...validPayload(), name: "" },
        ),
        routeParams(workoutId),
      );

      expect(response.status).toBe(400);
    });

    it("returns 404 and leaves data unchanged for unowned workouts", async () => {
      const workoutId = await seedWorkout(database, {
        userId: "user-2",
        name: "Protected Workout",
        notes: "Do not touch",
        exercises: [
          {
            name: "Bench Press",
            notes: "Original notes",
            sets: [{ weight: "225", reps: "5", rpe: "8" }],
          },
        ],
      });

      authState.userId = "user-1";

      const response = await PATCH(
        createJsonRequest(
          `http://localhost/api/workouts/${workoutId}`,
          "PATCH",
          {
            ...validPayload(),
            name: "Attacker Rewrite",
            exercises: [],
          },
        ),
        routeParams(workoutId),
      );

      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toEqual({
        error: "Workout not found",
      });

      const protectedWorkout = await database.db.query.workout.findFirst({
        where: eq(workout.id, workoutId),
        with: {
          exercises: {
            with: {
              sets: true,
            },
          },
        },
      });

      expect(protectedWorkout).toMatchObject({
        name: "Protected Workout",
        notes: "Do not touch",
      });
      expect(protectedWorkout?.exercises).toHaveLength(1);
      expect(protectedWorkout?.exercises[0]).toMatchObject({
        name: "Bench Press",
        notes: "Original notes",
      });
      expect(protectedWorkout?.exercises[0].sets).toHaveLength(1);
    });

    it("returns 404 for missing workouts", async () => {
      const response = await PATCH(
        createJsonRequest("http://localhost/api/workouts/9999", "PATCH", validPayload()),
        routeParams(9999),
      );

      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toEqual({
        error: "Workout not found",
      });
    });
  });

  describe("DELETE /api/workouts/:id", () => {
    it("deletes an owned workout and its dependent rows", async () => {
      const workoutId = await seedWorkout(database, {
        userId: "user-1",
        exercises: [
          {
            name: "Bench Press",
            sets: [
              { weight: "225", reps: "5", rpe: "8" },
              { weight: "235", reps: "3", rpe: "9" },
            ],
          },
        ],
      });

      const response = await DELETE(
        new NextRequest(`http://localhost/api/workouts/${workoutId}`, {
          method: "DELETE",
        }),
        routeParams(workoutId),
      );

      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("Workout successfully deleted");
      await expect(getCounts(database)).resolves.toEqual({
        workouts: 0,
        exercises: 0,
        sets: 0,
      });
    });

    it("returns 401 for unauthenticated delete requests", async () => {
      const workoutId = await seedWorkout(database, {
        userId: "user-1",
        exercises: [],
      });
      authState.userId = null;

      const response = await DELETE(
        new NextRequest(`http://localhost/api/workouts/${workoutId}`, {
          method: "DELETE",
        }),
        routeParams(workoutId),
      );

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    });

    it("returns 400 for invalid delete IDs", async () => {
      const response = await DELETE(
        new NextRequest("http://localhost/api/workouts/nope", {
          method: "DELETE",
        }),
        routeParams("nope"),
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        error: "Invalid workout id",
      });
    });

    it("returns 404 and leaves rows intact for unowned deletes", async () => {
      const workoutId = await seedWorkout(database, {
        userId: "user-2",
        exercises: [
          {
            name: "Pull Up",
            sets: [{ weight: "0", reps: "10", rpe: "8" }],
          },
        ],
      });

      authState.userId = "user-1";

      const response = await DELETE(
        new NextRequest(`http://localhost/api/workouts/${workoutId}`, {
          method: "DELETE",
        }),
        routeParams(workoutId),
      );

      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toEqual({
        error: "Workout not found",
      });
      await expect(getCounts(database)).resolves.toEqual({
        workouts: 1,
        exercises: 1,
        sets: 1,
      });
    });

    it("returns 404 for missing workouts", async () => {
      const response = await DELETE(
        new NextRequest("http://localhost/api/workouts/9999", {
          method: "DELETE",
        }),
        routeParams(9999),
      );

      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toEqual({
        error: "Workout not found",
      });
    });
  });
});

function routeParams(id: number | string) {
  return {
    params: Promise.resolve({ id: String(id) }),
  };
}

function createJsonRequest(url: string, method: string, body: unknown) {
  return new NextRequest(url, {
    method,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function validPayload() {
  return {
    date: "2026-04-02",
    name: "Workout",
    notes: "Notes",
    durationMinutes: 45,
    exercises: [
      {
        name: "Bench Press",
        notes: "",
        sets: [{ weight: "225", reps: "5", rpe: "8" }],
      },
    ],
  };
}

async function getCounts(database: RouteTestDatabase) {
  const [workoutCount] = await database.db
    .select({ value: count() })
    .from(workout);
  const [exerciseCount] = await database.db
    .select({ value: count() })
    .from(exercise);
  const [setCount] = await database.db
    .select({ value: count() })
    .from(set);

  return {
    workouts: workoutCount.value,
    exercises: exerciseCount.value,
    sets: setCount.value,
  };
}
