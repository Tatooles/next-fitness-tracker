import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Workout } from "@/lib/types";

const {
  authMock,
  findFirstMock,
  selectDistinctMock,
  selectDistinctFromMock,
  selectDistinctInnerJoinMock,
  selectDistinctWhereMock,
} = vi.hoisted(() => ({
  authMock: vi.fn(),
  findFirstMock: vi.fn(),
  selectDistinctMock: vi.fn(),
  selectDistinctFromMock: vi.fn(),
  selectDistinctInnerJoinMock: vi.fn(),
  selectDistinctWhereMock: vi.fn(),
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
    selectDistinct: selectDistinctMock,
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

const exerciseNamesFixture = ["Bench Press", "Overhead Press"];

describe("workout form seed builders", () => {
  beforeEach(() => {
    authMock.mockReset();
    authMock.mockResolvedValue({
      userId: "user-1",
      redirectToSignIn: vi.fn(),
    });
    findFirstMock.mockReset();
    selectDistinctMock.mockReset();
    selectDistinctFromMock.mockReset();
    selectDistinctInnerJoinMock.mockReset();
    selectDistinctWhereMock.mockReset();
    selectDistinctWhereMock.mockResolvedValue(
      exerciseNamesFixture.toReversed().map((name) => ({ name })),
    );
    selectDistinctInnerJoinMock.mockReturnValue({
      where: selectDistinctWhereMock,
    });
    selectDistinctFromMock.mockReturnValue({
      innerJoin: selectDistinctInnerJoinMock,
    });
    selectDistinctMock.mockReturnValue({
      from: selectDistinctFromMock,
    });
    vi.useRealTimers();
  });

  it("builds a blank create seed with one empty exercise row", () => {
    expect(buildBlankWorkoutFormSeed(exerciseNamesFixture)).toEqual({
      persistMode: "create",
      exerciseNames: exerciseNamesFixture,
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
    expect(
      buildEditWorkoutFormSeed(workoutFixture, exerciseNamesFixture),
    ).toEqual({
      persistMode: "update",
      workoutId: 1,
      exerciseNames: exerciseNamesFixture,
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
    expect(
      buildDuplicateWorkoutFormSeed(workoutFixture, exerciseNamesFixture),
    ).toEqual({
      persistMode: "create",
      exerciseNames: exerciseNamesFixture,
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

  it("stores reserved exercise names in a null-prototype template map", () => {
    const duplicateSeed = buildDuplicateWorkoutFormSeed({
      ...workoutFixture,
      exercises: [
        {
          ...workoutFixture.exercises[0],
          id: 21,
          name: "toString",
        },
        {
          ...workoutFixture.exercises[0],
          id: 22,
          name: "constructor",
        },
        {
          ...workoutFixture.exercises[0],
          id: 23,
          name: "__proto__",
        },
      ],
    });

    expect(
      Object.getPrototypeOf(duplicateSeed.templateValuesByExerciseName),
    ).toBeNull();
    expect(duplicateSeed.templateValuesByExerciseName?.toString).toMatchObject({
      name: "toString",
    });
    expect(
      duplicateSeed.templateValuesByExerciseName?.constructor,
    ).toMatchObject({
      name: "constructor",
    });
    expect(duplicateSeed.templateValuesByExerciseName?.__proto__).toMatchObject(
      {
        name: "__proto__",
      },
    );
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

  it("keeps the first reserved-name exercise when duplicates exist", () => {
    expect(
      buildDuplicateWorkoutFormSeed({
        ...workoutFixture,
        exercises: [
          {
            ...workoutFixture.exercises[0],
            id: 21,
            name: "toString",
          },
          {
            ...workoutFixture.exercises[0],
            id: 22,
            name: "toString",
            notes: "second",
            sets: [
              { id: 221, weight: "245", reps: "2", rpe: "9.5", exerciseId: 22 },
            ],
          },
        ],
      }).templateValuesByExerciseName?.toString,
    ).toEqual({
      name: "toString",
      notes: "",
      sets: [
        { weight: "225", reps: "5", rpe: "8" },
        { weight: "235", reps: "3", rpe: "9" },
      ],
    });
  });

  it("returns empty template values when there are no exercises", () => {
    const duplicateSeed = buildDuplicateWorkoutFormSeed({
      ...workoutFixture,
      exercises: [],
    });

    expect(duplicateSeed.persistMode).toBe("create");
    expect(duplicateSeed.exerciseNames).toEqual([]);
    expect(duplicateSeed.initialValues).toEqual({
      name: "Copy of Push Day",
      date: "",
      notes: "",
      durationMinutes: null,
      exercises: [],
    });
    expect(duplicateSeed.templateValuesByExerciseName).toEqual({});
    expect(
      Object.getPrototypeOf(duplicateSeed.templateValuesByExerciseName),
    ).toBeNull();
  });

  it("routes create mode through the shared builder and loads exercise names", async () => {
    await expect(buildWorkoutFormSeed({ kind: "create" })).resolves.toEqual(
      buildBlankWorkoutFormSeed(exerciseNamesFixture),
    );
    expect(findFirstMock).not.toHaveBeenCalled();
    expect(selectDistinctMock).toHaveBeenCalledTimes(1);
  });

  it("returns an edit seed from the shared builder when the workout is found", async () => {
    findFirstMock.mockResolvedValueOnce(workoutFixture);

    await expect(
      buildWorkoutFormSeed({ kind: "edit", workoutId: 1 }),
    ).resolves.toEqual(
      buildEditWorkoutFormSeed(workoutFixture, exerciseNamesFixture),
    );
    expect(findFirstMock).toHaveBeenCalledWith(
      expect.objectContaining({
        with: expect.objectContaining({
          exercises: expect.objectContaining({
            orderBy: expect.any(Function),
            with: expect.objectContaining({
              sets: expect.objectContaining({
                orderBy: expect.any(Function),
              }),
            }),
          }),
        }),
      }),
    );
  });

  it("returns null from the shared builder when the workout is missing", async () => {
    findFirstMock.mockResolvedValueOnce(null);

    await expect(
      buildWorkoutFormSeed({ kind: "duplicate", workoutId: 1 }),
    ).resolves.toBeNull();
    expect(selectDistinctMock).toHaveBeenCalledTimes(1);
  });
});
