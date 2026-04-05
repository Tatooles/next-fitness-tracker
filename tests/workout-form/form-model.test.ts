import { describe, expect, it } from "vitest";
import {
  buildDuplicateWorkoutFormSeed,
} from "@/components/workout-form/form-model";
import type { Workout } from "@/lib/types";

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

describe("buildDuplicateWorkoutFormSeed", () => {
  it("builds a duplicate form seed from the helper pipeline", () => {
    expect(buildDuplicateWorkoutFormSeed(workoutFixture)).toEqual({
      persistMode: "create",
      initialValues: {
        name: "Copy of Push Day",
        date: expect.any(String),
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
            sets: [{ id: 121, weight: "245", reps: "2", rpe: "9.5", exerciseId: 12 }],
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
        date: expect.any(String),
        notes: "",
        durationMinutes: null,
        exercises: [],
      },
      templateValuesByExerciseName: {},
    });
  });
});
