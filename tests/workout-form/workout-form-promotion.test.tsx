// @vitest-environment jsdom

import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { WorkoutDraft } from "@/components/workout-form/form-types";

vi.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: (props: React.ComponentProps<"button">) => (
    <button type="button" {...props}>
      Sidebar
    </button>
  ),
}));

vi.mock("@/components/workout-form/exercise-item", async () => {
  return {
    default: function MockExerciseItem({
      index,
      exerciseName,
      workoutId,
      templateExercise,
    }: {
      index: number;
      exerciseName: string;
      workoutId?: number;
      templateExercise?: { name: string };
    }) {
      return (
        <div
          data-testid={`exercise-item-${index}`}
          data-exercise-name={exerciseName}
          data-has-template={String(Boolean(templateExercise))}
          data-workout-id={workoutId?.toString() ?? ""}
        >
          Exercise row {index}
        </div>
      );
    },
  };
});

import WorkoutForm from "@/components/workout-form/workout-form";

const workoutDraftFixture: WorkoutDraft = {
  name: "Push Day",
  date: "2026-04-06",
  notes: "Top sets",
  durationMinutes: 65,
  exercises: [
    {
      name: "Bench Press",
      notes: "Pause the first rep",
      sets: [{ weight: "225", reps: "5", rpe: "8" }],
    },
  ],
};

function createFetchResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });
}

function getWorkoutSaveCalls(fetchMock: ReturnType<typeof vi.fn>) {
  return fetchMock.mock.calls.filter(([url]) =>
    typeof url === "string" && url.startsWith("/api/workouts"),
  );
}

describe("WorkoutForm promotion flow", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";

      if (url === "/api/exercises" && method === "GET") {
        return createFetchResponse(["Bench Press", "Overhead Press"]);
      }

      if (url === "/api/workouts" && method === "POST") {
        return createFetchResponse({ workoutId: 42 }, { status: 201 });
      }

      if (url === "/api/workouts/42" && method === "PATCH") {
        return createFetchResponse({ message: "Workout updated" });
      }

      throw new Error(`Unexpected fetch request: ${method} ${url}`);
    }));
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("promotes create mode to update mode in place after the first save", async () => {
    const replaceStateSpy = vi.spyOn(window.history, "replaceState");
    const user = userEvent.setup();

    render(
      <WorkoutForm
        initialValues={workoutDraftFixture}
        persistMode="create"
      />,
    );

    await screen.findByTestId("exercise-item-0");
    const workoutNameInput = screen.getByLabelText("Workout Name");

    expect(screen.getByText("Not saved")).toBeTruthy();
    expect(
      screen.getByTestId("exercise-item-0").getAttribute("data-workout-id"),
    ).toBe("");

    await user.clear(workoutNameInput);
    await user.type(workoutNameInput, "Promoted Push Day");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Saved");

    const replaceStateCall = replaceStateSpy.mock.calls.at(-1);
    expect(replaceStateCall).toBeTruthy();
    expect(replaceStateCall?.[2]).toBe("/workouts/edit/42");

    expect(screen.getByTestId("exercise-item-0").textContent).toContain(
      "Exercise row 0",
    );
    expect(
      screen.getByTestId("exercise-item-0").getAttribute("data-workout-id"),
    ).toBe("42");
    expect(
      (screen.getByLabelText("Workout Name") as HTMLInputElement).value,
    ).toBe("Promoted Push Day");

    const fetchMock = vi.mocked(fetch);
    expect(getWorkoutSaveCalls(fetchMock)).toHaveLength(1);
    expect(getWorkoutSaveCalls(fetchMock)[0]?.[0]).toBe("/api/workouts");
    expect(getWorkoutSaveCalls(fetchMock)[0]?.[1]).toMatchObject({
      method: "POST",
    });

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(getWorkoutSaveCalls(fetchMock)).toHaveLength(2);
    });

    expect(getWorkoutSaveCalls(fetchMock)[1]?.[0]).toBe("/api/workouts/42");
    expect(getWorkoutSaveCalls(fetchMock)[1]?.[1]).toMatchObject({
      method: "PATCH",
    });
  });

  it("keeps duplicate template hints after the first successful save", async () => {
    const user = userEvent.setup();

    render(
      <WorkoutForm
        initialValues={workoutDraftFixture}
        persistMode="create"
        templateValuesByExerciseName={{
          "Bench Press": {
            name: "Bench Press",
            notes: "",
            sets: [{ weight: "200", reps: "6", rpe: "7" }],
          },
        }}
      />,
    );

    const exerciseRow = await screen.findByTestId("exercise-item-0");
    expect(exerciseRow.getAttribute("data-has-template")).toBe("true");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Saved");

    expect(
      screen.getByTestId("exercise-item-0").getAttribute("data-has-template"),
    ).toBe("true");
  });
});
