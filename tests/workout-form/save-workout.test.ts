import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { WorkoutDraft } from "@/components/workout-form/form-types";

const { toastErrorMock } = vi.hoisted(() => ({
  toastErrorMock: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: toastErrorMock,
  },
}));

import { saveWorkout } from "@/components/workout-form/save-workout";

const workoutDraftFixture: WorkoutDraft = {
  name: "Push Day",
  date: "2026-04-06",
  notes: "Top sets",
  durationMinutes: 65,
  exercises: [
    {
      name: "Bench Press",
      notes: "Pause the first rep",
      supersetGroupId: "superset-a",
      sets: [{ weight: "225", reps: "5", rpe: "8" }],
    },
  ],
};

describe("saveWorkout", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    toastErrorMock.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the new workout id for create success and sends the normalized request", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ workoutId: 42 }), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    await expect(
      saveWorkout({
        persistMode: "create",
        values: workoutDraftFixture,
      }),
    ).resolves.toEqual({ ok: true, workoutId: 42 });

    expect(fetchMock).toHaveBeenCalledWith("/api/workouts", {
      method: "POST",
      body: JSON.stringify(workoutDraftFixture),
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it("returns the existing workout id for update success and patches the workout", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Workout updated" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    await expect(
      saveWorkout({
        persistMode: "update",
        workoutId: 17,
        values: workoutDraftFixture,
      }),
    ).resolves.toEqual({ ok: true, workoutId: 17 });

    expect(fetchMock).toHaveBeenCalledWith("/api/workouts/17", {
      method: "PATCH",
      body: JSON.stringify(workoutDraftFixture),
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it("returns a failed result and emits the create toast for non-ok create responses", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "bad request" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    await expect(
      saveWorkout({
        persistMode: "create",
        values: workoutDraftFixture,
      }),
    ).resolves.toEqual({ ok: false });

    expect(toastErrorMock).toHaveBeenCalledWith("Failed to create workout");
  });

  it("returns a failed result and emits the update toast for non-ok update responses", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    await expect(
      saveWorkout({
        persistMode: "update",
        workoutId: 17,
        values: workoutDraftFixture,
      }),
    ).resolves.toEqual({ ok: false });

    expect(toastErrorMock).toHaveBeenCalledWith("Failed to save workout");
  });

  it("returns a failed result and emits the create toast when the create success payload is malformed", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Workout created" }), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );

    await expect(
      saveWorkout({
        persistMode: "create",
        values: workoutDraftFixture,
      }),
    ).resolves.toEqual({ ok: false });

    expect(toastErrorMock).toHaveBeenCalledWith("Failed to create workout");
  });

  it("throws before fetching when update mode is missing a workout id", async () => {
    const fetchMock = vi.mocked(fetch);

    await expect(
      saveWorkout({
        persistMode: "update",
        values: workoutDraftFixture,
      }),
    ).rejects.toThrow("saveWorkout requires workoutId in update mode");

    expect(fetchMock).not.toHaveBeenCalled();
    expect(toastErrorMock).not.toHaveBeenCalled();
  });
});
