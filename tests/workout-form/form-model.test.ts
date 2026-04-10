import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Workout } from "@/lib/types";

const { authMock, findFirstMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  findFirstMock: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: authMock,
}));

vi.mock("@/db/drizzle", () => ({
  db: {
    query: {
      workout: {
        findFirst: findFirstMock,
      },
    },
  },
}));

import {
  buildBlankWorkoutFormSeed,
  buildDuplicateWorkoutFormSeed,
  buildEditWorkoutFormSeed,
  buildWorkoutFormSeed,
} from "@/components/workout-form/form-model";

const workoutFixture: Workout = {
  id: 1,
  name: "Push Day",
  notes: "Original notes",
  durationMinutes: 70,
  userId: "user-1",
  date: "2026-04-04",
  exercises: [
    {
      id: 11,
      name: "Bench Press",
      notes: "Original exercise notes",
      workoutId: 1,
      sets: [
        { id: 111, weight: "225", reps: "5", rpe: "8", exerciseId: 11 },
        { id: 112, weight: "235", reps: "3", rpe: "9", exerciseId: 11 },
      ],
    },
  ],
};

describe("workout form seed builders", () => {
  beforeEach(() => {
    authMock.mockReset();
    authMock.mockResolvedValue({
      userId: "user-1",
      redirectToSignIn: vi.fn(),
    });
    findFirstMock.mockReset();
    vi.useRealTimers();
  });

  it("builds a blank create seed with one empty exercise row", () => {
    expect(buildBlankWorkoutFormSeed()).toEqual({
      persistMode: "create",
      initialValues: {
        name: "",
        date: "",
        notes: "",
        durationMinutes: null,
        exercises: [
          {
            name: "",
            notes: "",
            sets: [{ weight: "", reps: "", rpe: "" }],
          },
        ],
      },
    });
  });

  it("builds an edit seed that preserves the workout values and id", () => {
    expect(buildEditWorkoutFormSeed(workoutFixture)).toEqual({
      persistMode: "update",
      workoutId: 1,
      initialValues: {
        name: "Push Day",
        date: "2026-04-04",
        notes: "Original notes",
        durationMinutes: 70,
        exercises: [
          {
            name: "Bench Press",
            notes: "Original exercise notes",
            sets: [
              { weight: "225", reps: "5", rpe: "8" },
              { weight: "235", reps: "3", rpe: "9" },
            ],
          },
        ],
      },
    });
  });

  it("builds a duplicate form seed from the helper pipeline", () => {
    expect(buildDuplicateWorkoutFormSeed(workoutFixture)).toEqual({
      persistMode: "create",
      initialValues: {
        name: "Copy of Push Day",
        date: "",
        notes: "",
        durationMinutes: null,
        exercises: [
          {
            name: "Bench Press",
            notes: "",
            sets: [
              { weight: "", reps: "", rpe: "" },
              { weight: "", reps: "", rpe: "" },
            ],
          },
        ],
      },
      templateValuesByExerciseName: {
        "Bench Press": {
          name: "Bench Press",
          notes: "",
          sets: [
            { weight: "225", reps: "5", rpe: "8" },
            { weight: "235", reps: "3", rpe: "9" },
          ],
        },
      },
    });
  });

  it("keeps the first matching exercise when duplicate names exist", () => {
    expect(
      buildDuplicateWorkoutFormSeed({
        ...workoutFixture,
        exercises: [
          workoutFixture.exercises[0],
          {
            ...workoutFixture.exercises[0],
            id: 12,
            notes: "second",
            sets: [
              { id: 121, weight: "245", reps: "2", rpe: "9.5", exerciseId: 12 },
            ],
          },
        ],
      }).templateValuesByExerciseName,
    ).toEqual({
      "Bench Press": {
        name: "Bench Press",
        notes: "",
        sets: [
          { weight: "225", reps: "5", rpe: "8" },
          { weight: "235", reps: "3", rpe: "9" },
        ],
      },
    });
  });

  it("returns empty template values when there are no exercises", () => {
    expect(
      buildDuplicateWorkoutFormSeed({
        ...workoutFixture,
        exercises: [],
      }),
    ).toEqual({
      persistMode: "create",
      initialValues: {
        name: "Copy of Push Day",
        date: "",
        notes: "",
        durationMinutes: null,
        exercises: [],
      },
      templateValuesByExerciseName: {},
    });
  });

  it("routes create mode through the shared builder without querying the database", async () => {
    await expect(buildWorkoutFormSeed({ kind: "create" })).resolves.toEqual(
      buildBlankWorkoutFormSeed(),
    );
    expect(findFirstMock).not.toHaveBeenCalled();
  });

  it("returns an edit seed from the shared builder when the workout is found", async () => {
    findFirstMock.mockResolvedValueOnce(workoutFixture);

    await expect(
      buildWorkoutFormSeed({ kind: "edit", workoutId: 1 }),
    ).resolves.toEqual(buildEditWorkoutFormSeed(workoutFixture));
  });

  it("returns null from the shared builder when the workout is missing", async () => {
    findFirstMock.mockResolvedValueOnce(null);

    await expect(
      buildWorkoutFormSeed({ kind: "duplicate", workoutId: 1 }),
    ).resolves.toBeNull();
  });
});
