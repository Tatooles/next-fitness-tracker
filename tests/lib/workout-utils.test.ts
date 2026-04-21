import { beforeEach, describe, expect, it, vi } from "vitest";
import { copyWorkoutToClipboard } from "@/lib/workout-utils";
import type { Workout } from "@/lib/types";

const { toastSuccessMock, toastErrorMock, writeTextMock } = vi.hoisted(() => ({
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
  writeTextMock: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

const workoutFixture: Workout = {
  id: 1,
  userId: "user-1",
  name: "Push Day",
  notes: "Strong session",
  durationMinutes: 60,
  date: "2026-04-18",
  exercises: [
    {
      id: 10,
      workoutId: 1,
      name: "Bench Press",
      notes: "",
      supersetGroupId: "superset-a",
      sets: [{ id: 100, exerciseId: 10, weight: "225", reps: "5", rpe: "8" }],
    },
    {
      id: 11,
      workoutId: 1,
      name: "Chest Supported Row",
      notes: "",
      supersetGroupId: "superset-a",
      sets: [{ id: 101, exerciseId: 11, weight: "180", reps: "8", rpe: "8" }],
    },
    {
      id: 12,
      workoutId: 1,
      name: "Bicep Curl",
      notes: "",
      supersetGroupId: null,
      sets: [{ id: 102, exerciseId: 12, weight: "40", reps: "12", rpe: "9" }],
    },
  ],
};

describe("copyWorkoutToClipboard", () => {
  beforeEach(() => {
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
    writeTextMock.mockReset();
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText: writeTextMock,
      },
    });
  });

  it("adds a Superset heading before grouped exercises", async () => {
    await copyWorkoutToClipboard(workoutFixture);

    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining("\nSuperset\nBench Press\n"));
    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining("Chest Supported Row"));
    expect(toastSuccessMock).toHaveBeenCalledTimes(1);
  });
});
