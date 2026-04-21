import { describe, expect, it } from "vitest";
import {
  groupExercisesForDisplay,
  joinSupersetWithPrevious,
  moveExerciseBlock,
  removeExerciseAtIndex,
  removeExerciseFromSuperset,
  startSupersetWithNext,
} from "@/lib/superset-utils";

const exercises = [
  {
    name: "Bench Press",
    notes: "",
    supersetGroupId: null,
    sets: [{ weight: "225", reps: "5", rpe: "8" }],
  },
  {
    name: "Chest Supported Row",
    notes: "",
    supersetGroupId: null,
    sets: [{ weight: "180", reps: "8", rpe: "8" }],
  },
  {
    name: "Bicep Curl",
    notes: "",
    supersetGroupId: null,
    sets: [{ weight: "40", reps: "12", rpe: "9" }],
  },
];

describe("superset utilities", () => {
  it("starts a superset with the next exercise using the supplied group id", () => {
    const updated = startSupersetWithNext(exercises, 0, "superset-a");

    expect(updated[0].supersetGroupId).toBe("superset-a");
    expect(updated[1].supersetGroupId).toBe("superset-a");
    expect(updated[2].supersetGroupId).toBeNull();
  });

  it("joins the previous superset when one exists", () => {
    const updated = joinSupersetWithPrevious(
      [
        { ...exercises[0], supersetGroupId: "superset-a" },
        { ...exercises[1], supersetGroupId: "superset-a" },
        exercises[2],
      ],
      2,
      () => "unused",
    );

    expect(updated.map((exercise) => exercise.supersetGroupId)).toEqual([
      "superset-a",
      "superset-a",
      "superset-a",
    ]);
  });

  it("creates a new pair when joining the previous exercise without an existing superset", () => {
    const updated = joinSupersetWithPrevious(exercises, 1, () => "superset-b");

    expect(updated.map((exercise) => exercise.supersetGroupId)).toEqual([
      "superset-b",
      "superset-b",
      null,
    ]);
  });

  it("removes one exercise from a pair and clears the remaining singleton group", () => {
    const updated = removeExerciseFromSuperset(
      [
        { ...exercises[0], supersetGroupId: "superset-a" },
        { ...exercises[1], supersetGroupId: "superset-a" },
        exercises[2],
      ],
      0,
    );

    expect(updated.map((exercise) => exercise.supersetGroupId)).toEqual([
      null,
      null,
      null,
    ]);
  });

  it("removes a middle exercise from a larger superset and clears the split group", () => {
    const updated = removeExerciseFromSuperset(
      [
        exercises[0],
        { ...exercises[0], name: "Pulldown", supersetGroupId: "superset-a" },
        { ...exercises[1], supersetGroupId: "superset-a" },
        { ...exercises[2], supersetGroupId: "superset-a" },
      ],
      2,
    );

    expect(updated.map((exercise) => exercise.supersetGroupId)).toEqual([
      null,
      null,
      null,
      null,
    ]);
  });

  it("moves an entire superset block when one member moves down", () => {
    const updated = moveExerciseBlock(
      [
        { ...exercises[0], supersetGroupId: "superset-a" },
        { ...exercises[1], supersetGroupId: "superset-a" },
        exercises[2],
      ],
      1,
      "down",
    );

    expect(updated.map((exercise) => exercise.name)).toEqual([
      "Bicep Curl",
      "Bench Press",
      "Chest Supported Row",
    ]);
  });

  it("normalizes a leftover singleton group when deleting a grouped exercise", () => {
    const updated = removeExerciseAtIndex(
      [
        { ...exercises[0], supersetGroupId: "superset-a" },
        { ...exercises[1], supersetGroupId: "superset-a" },
        exercises[2],
      ],
      0,
    );

    expect(updated).toHaveLength(2);
    expect(updated[0].name).toBe("Chest Supported Row");
    expect(updated[0].supersetGroupId).toBeNull();
  });

  it("groups adjacent superset exercises into display blocks", () => {
    const blocks = groupExercisesForDisplay([
      { ...exercises[0], supersetGroupId: "superset-a" },
      { ...exercises[1], supersetGroupId: "superset-a" },
      exercises[2],
    ]);

    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toMatchObject({
      kind: "superset",
      supersetGroupId: "superset-a",
      startIndex: 0,
      endIndex: 1,
    });
    expect(blocks[0].exercises.map((exercise) => exercise.name)).toEqual([
      "Bench Press",
      "Chest Supported Row",
    ]);
    expect(blocks[1]).toMatchObject({
      kind: "single",
      startIndex: 2,
      endIndex: 2,
    });
  });
});
