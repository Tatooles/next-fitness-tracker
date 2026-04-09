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

vi.mock("@/components/workout-form/exercise-selector", () => ({
  default: function MockExerciseSelector({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) {
    return (
      <button
        type="button"
        data-testid="exercise-selector"
        data-value={value}
        onClick={() => onChange("Overhead Press")}
      >
        {value || "Select exercise"}
      </button>
    );
  },
}));

vi.mock("@/components/workout-form/exercise-actions-menu", () => ({
  default: function MockExerciseActionsMenu({
    workoutId,
    onDelete,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
  }: {
    workoutId?: number;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
  }) {
    return (
      <div data-testid="exercise-actions-menu" data-workout-id={workoutId ?? ""}>
        <button type="button" onClick={onMoveUp} disabled={isFirst}>
          Move Up
        </button>
        <button type="button" onClick={onMoveDown} disabled={isLast}>
          Move Down
        </button>
        <button type="button" onClick={onDelete}>
          Delete Exercise
        </button>
      </div>
    );
  },
}));

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

function buildWorkoutDraft(
  overrides: Partial<WorkoutDraft> = {},
): WorkoutDraft {
  return {
    ...structuredClone(workoutDraftFixture),
    ...overrides,
  };
}

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
    vi.spyOn(console, "error").mockImplementation(() => {});
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

    await screen.findByTestId("exercise-selector");
    const workoutNameInput = screen.getByLabelText("Workout Name");

    expect(screen.getByText("Not saved")).toBeTruthy();
    expect(
      screen.getAllByTestId("exercise-actions-menu")[0]?.getAttribute(
        "data-workout-id",
      ),
    ).toBe("");

    await user.clear(workoutNameInput);
    await user.type(workoutNameInput, "Promoted Push Day");

    expect(screen.getByText("Not saved")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Saved");

    const replaceStateCall = replaceStateSpy.mock.calls.at(-1);
    expect(replaceStateCall).toBeTruthy();
    expect(replaceStateCall?.[2]).toBe("/workouts/edit/42");

    expect(screen.getAllByTestId("exercise-selector")).toHaveLength(1);
    expect(screen.getByTestId("exercise-selector").getAttribute("data-value")).toBe(
      "Bench Press",
    );
    expect(
      screen.getAllByTestId("exercise-actions-menu")[0]?.getAttribute(
        "data-workout-id",
      ),
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

  it("preserves local edits when rerendered with equal-content props", async () => {
    const user = userEvent.setup();
    const createSeed = buildWorkoutDraft();
    const { rerender } = render(
      <WorkoutForm
        initialValues={createSeed}
        persistMode="update"
        workoutId={17}
      />,
    );

    await screen.findByTestId("exercise-selector");
    const workoutNameInput = screen.getByLabelText(
      "Workout Name",
    ) as HTMLInputElement;

    await user.clear(workoutNameInput);
    await user.type(workoutNameInput, "Edited Locally");

    expect(screen.getByText("Unsaved changes")).toBeTruthy();
    expect(workoutNameInput.value).toBe("Edited Locally");

    rerender(
      <WorkoutForm
        initialValues={buildWorkoutDraft()}
        persistMode="update"
        workoutId={17}
      />,
    );

    expect(screen.getByText("Unsaved changes")).toBeTruthy();
    expect(
      (screen.getByLabelText("Workout Name") as HTMLInputElement).value,
    ).toBe("Edited Locally");
  });

  it("replaces the form when the external seed changes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <WorkoutForm
        initialValues={buildWorkoutDraft()}
        persistMode="create"
      />,
    );

    const workoutNameInput = (await screen.findByLabelText(
      "Workout Name",
    )) as HTMLInputElement;

    await user.clear(workoutNameInput);
    await user.type(workoutNameInput, "Temporary edit");

    expect(screen.getByText("Not saved")).toBeTruthy();

    rerender(
      <WorkoutForm
        initialValues={buildWorkoutDraft({
          name: "Leg Day",
          date: "2026-04-08",
        })}
        persistMode="update"
        workoutId={77}
        templateValuesByExerciseName={{
          "Bench Press": {
            name: "Bench Press",
            notes: "",
            sets: [{ weight: "205", reps: "5", rpe: "8" }],
          },
        }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeTruthy();
      expect(
        (screen.getByLabelText("Workout Name") as HTMLInputElement).value,
      ).toBe("Leg Day");
      expect(
        screen.getAllByTestId("exercise-actions-menu")[0]?.getAttribute(
          "data-workout-id",
        ),
      ).toBe("77");
      expect(screen.getByPlaceholderText("205")).toBeTruthy();
    });
  });

  it("clears failed create status after a native input edit without resetting the draft", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";

      if (url === "/api/exercises" && method === "GET") {
        return createFetchResponse(["Bench Press", "Overhead Press"]);
      }

      if (url === "/api/workouts" && method === "POST") {
        return createFetchResponse({ error: "bad request" }, { status: 400 });
      }

      throw new Error(`Unexpected fetch request: ${method} ${url}`);
    });

    const user = userEvent.setup();
    render(
      <WorkoutForm
        initialValues={buildWorkoutDraft()}
        persistMode="create"
      />,
    );

    await screen.findByTestId("exercise-selector");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Save failed");

    const workoutNameInput = screen.getByLabelText(
      "Workout Name",
    ) as HTMLInputElement;

    await user.clear(workoutNameInput);
    await user.type(workoutNameInput, "Recovered Create Draft");

    await waitFor(() => {
      expect(screen.queryByText("Save failed")).toBeNull();
      expect(screen.getByText("Not saved")).toBeTruthy();
      expect(workoutNameInput.value).toBe("Recovered Create Draft");
    });
  });

  it("clears failed update status after a native input edit and keeps the draft dirty", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";

      if (url === "/api/exercises" && method === "GET") {
        return createFetchResponse(["Bench Press", "Overhead Press"]);
      }

      if (url === "/api/workouts/17" && method === "PATCH") {
        return createFetchResponse({ error: "bad request" }, { status: 400 });
      }

      throw new Error(`Unexpected fetch request: ${method} ${url}`);
    });

    const user = userEvent.setup();

    render(
      <WorkoutForm
        initialValues={buildWorkoutDraft()}
        persistMode="update"
        workoutId={17}
      />,
    );

    await screen.findByTestId("exercise-selector");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Save failed");

    const workoutNameInput = screen.getByLabelText(
      "Workout Name",
    ) as HTMLInputElement;

    await user.clear(workoutNameInput);
    await user.type(workoutNameInput, "Recovered Update Draft");

    await waitFor(() => {
      expect(screen.queryByText("Save failed")).toBeNull();
      expect(screen.getByText("Unsaved changes")).toBeTruthy();
      expect(workoutNameInput.value).toBe("Recovered Update Draft");
    });
  });

  it("clears failed update status after adding a set", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";

      if (url === "/api/exercises" && method === "GET") {
        return createFetchResponse(["Bench Press", "Overhead Press"]);
      }

      if (url === "/api/workouts/17" && method === "PATCH") {
        return createFetchResponse({ error: "bad request" }, { status: 400 });
      }

      throw new Error(`Unexpected fetch request: ${method} ${url}`);
    });

    const user = userEvent.setup();

    render(
      <WorkoutForm
        initialValues={buildWorkoutDraft()}
        persistMode="update"
        workoutId={17}
      />,
    );

    await screen.findByTestId("exercise-selector");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Save failed");

    expect(screen.getAllByPlaceholderText("Weight")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Add set" }));

    await waitFor(() => {
      expect(screen.queryByText("Save failed")).toBeNull();
      expect(screen.getByText("Unsaved changes")).toBeTruthy();
      expect(screen.getAllByPlaceholderText("Weight")).toHaveLength(2);
    });
  });

  it("clears failed create status when the exercise selector changes", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";

      if (url === "/api/exercises" && method === "GET") {
        return createFetchResponse(["Bench Press", "Overhead Press"]);
      }

      if (url === "/api/workouts" && method === "POST") {
        return createFetchResponse({ error: "bad request" }, { status: 400 });
      }

      throw new Error(`Unexpected fetch request: ${method} ${url}`);
    });

    const user = userEvent.setup();

    render(
      <WorkoutForm
        initialValues={buildWorkoutDraft()}
        persistMode="create"
      />,
    );

    const exerciseSelector = await screen.findByTestId("exercise-selector");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Save failed");

    await user.click(exerciseSelector);

    await waitFor(() => {
      expect(screen.queryByText("Save failed")).toBeNull();
      expect(screen.getByText("Not saved")).toBeTruthy();
      expect(screen.getByTestId("exercise-selector").getAttribute("data-value")).toBe(
        "Overhead Press",
      );
    });
  });

  it("clears stale save failure state when a new external seed arrives", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";

      if (url === "/api/exercises" && method === "GET") {
        return createFetchResponse(["Bench Press", "Overhead Press"]);
      }

      if (url === "/api/workouts" && method === "POST") {
        return createFetchResponse({ error: "bad request" }, { status: 400 });
      }

      throw new Error(`Unexpected fetch request: ${method} ${url}`);
    });

    const user = userEvent.setup();
    const { rerender } = render(
      <WorkoutForm
        initialValues={buildWorkoutDraft()}
        persistMode="create"
      />,
    );

    await screen.findByTestId("exercise-selector");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Save failed");

    rerender(
      <WorkoutForm
        initialValues={buildWorkoutDraft({
          name: "Recovered Seed",
        })}
        persistMode="update"
        workoutId={88}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText("Save failed")).toBeNull();
      expect(screen.getByText("Saved")).toBeTruthy();
      expect(
        (screen.getByLabelText("Workout Name") as HTMLInputElement).value,
      ).toBe("Recovered Seed");
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

    expect(await screen.findByPlaceholderText("200")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Saved");

    expect(screen.getByPlaceholderText("200")).toBeTruthy();
  });
});
