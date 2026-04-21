import { describe, expect, it } from "vitest";
import { workoutFormSchema } from "@/lib/types";

const validPayload = {
  date: "2026-04-18",
  name: "Push Day",
  notes: "",
  durationMinutes: 60,
  exercises: [
    {
      name: "Bench Press",
      notes: "",
      supersetGroupId: "superset-a",
      sets: [{ weight: "225", reps: "5", rpe: "8" }],
    },
    {
      name: "Chest Supported Row",
      notes: "",
      supersetGroupId: "superset-a",
      sets: [{ weight: "180", reps: "8", rpe: "8" }],
    },
    {
      name: "Lateral Raise",
      notes: "",
      supersetGroupId: null,
      sets: [{ weight: "20", reps: "15", rpe: "9" }],
    },
  ],
};

describe("workoutFormSchema superset validation", () => {
  it("accepts adjacent exercises that share a superset group id", () => {
    expect(workoutFormSchema.safeParse(validPayload).success).toBe(true);
  });

  it("rejects superset ids that appear on non-adjacent exercises", () => {
    const result = workoutFormSchema.safeParse({
      ...validPayload,
      exercises: [
        validPayload.exercises[0],
        {
          ...validPayload.exercises[1],
          supersetGroupId: null,
        },
        {
          ...validPayload.exercises[2],
          supersetGroupId: "superset-a",
        },
      ],
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toContain("adjacent");
  });

  it("rejects a superset group with only one exercise", () => {
    const result = workoutFormSchema.safeParse({
      ...validPayload,
      exercises: [
        {
          ...validPayload.exercises[0],
          supersetGroupId: "solo-group",
        },
        {
          ...validPayload.exercises[1],
          supersetGroupId: null,
        },
        {
          ...validPayload.exercises[2],
          supersetGroupId: null,
        },
      ],
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toContain("at least 2");
  });
});
