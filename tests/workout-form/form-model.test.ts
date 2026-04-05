import { describe, expect, it } from "vitest";
import {
  toTemplateValuesByExerciseName,
  type ExerciseTemplateValues,
} from "@/components/workout-form/form-model";

describe("toTemplateValuesByExerciseName", () => {
  it("returns a keyed object by exercise name", () => {
    const hints: ExerciseTemplateValues[] = [
      {
        name: "Bench Press",
        notes: "",
        sets: [{ weight: "225", reps: "5", rpe: "8" }],
      },
      {
        name: "Row",
        notes: "",
        sets: [{ weight: "185", reps: "8", rpe: "7" }],
      },
    ];

    expect(toTemplateValuesByExerciseName(hints)).toEqual({
      "Bench Press": hints[0],
      Row: hints[1],
    });
  });

  it("preserves the first matching exercise when duplicate names exist", () => {
    const firstHint: ExerciseTemplateValues = {
      name: "Bench Press",
      notes: "first",
      sets: [{ weight: "225", reps: "5", rpe: "8" }],
    };
    const secondHint: ExerciseTemplateValues = {
      name: "Bench Press",
      notes: "second",
      sets: [{ weight: "235", reps: "3", rpe: "9" }],
    };

    expect(
      toTemplateValuesByExerciseName([firstHint, secondHint])["Bench Press"],
    ).toBe(firstHint);
  });

  it("returns an empty object for an empty list", () => {
    expect(toTemplateValuesByExerciseName([])).toEqual({});
  });
});
