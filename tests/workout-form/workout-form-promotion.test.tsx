// @vitest-environment jsdom

import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {
  ExerciseTemplateValuesByName,
  WorkoutDraft,
} from "@/components/workout-form/form-types";

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
      supersetGroupId: null,
      sets: [{ weight: "225", reps: "5", rpe: "8" }],
    },
  ],
};

const exerciseNamesFixture = ["Bench Press", "Overhead Press"];

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
  return fetchMock.mock.calls.filter(
    ([url]) => typeof url === "string" && url.startsWith("/api/workouts"),
  );
}

describe("WorkoutForm promotion flow", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? "GET";

        if (url === "/api/workouts" && method === "POST") {
          return createFetchResponse({ workoutId: 42 }, { status: 201 });
        }

        if (url === "/api/workouts/42" && method === "PATCH") {
          return createFetchResponse({ message: "Workout updated" });
        }

        throw new Error(`Unexpected fetch request: ${method} ${url}`);
      }),
    );
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("initializes a blank create date from the browser after mount", async () => {
    vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue(
      "2026-04-06",
    );

    render(
      <WorkoutForm
        initialValues={buildWorkoutDraft({ date: "" })}
        persistMode="create"
        exerciseNames={exerciseNamesFixture}
      />,
    );

    const dateInput = (await screen.findByLabelText(
      "Date",
    )) as HTMLInputElement;

    await waitFor(() => {
      expect(dateInput.value).toBe(new Date().toLocaleDateString("en-CA"));
    });
  });

  it("initializes a blank duplicate date from the browser after mount", async () => {
    vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue(
      "2026-04-06",
    );

    render(
      <WorkoutForm
        initialValues={buildWorkoutDraft({ date: "" })}
        persistMode="create"
        exerciseNames={exerciseNamesFixture}
        templateValuesByExerciseName={{
          "Bench Press": {
            name: "Bench Press",
            notes: "",
            supersetGroupId: null,
            sets: [{ weight: "200", reps: "6", rpe: "7" }],
          },
        }}
      />,
    );

    const dateInput = (await screen.findByLabelText(
      "Date",
    )) as HTMLInputElement;

    await waitFor(() => {
      expect(dateInput.value).toBe(new Date().toLocaleDateString("en-CA"));
    });
  });

  it("does not auto-fill a supplied update date", async () => {
    vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue(
      "2026-04-06",
    );

    render(
      <WorkoutForm
        initialValues={buildWorkoutDraft({ date: "2026-04-08" })}
        persistMode="update"
        exerciseNames={exerciseNamesFixture}
        workoutId={17}
      />,
    );

    const dateInput = (await screen.findByLabelText(
      "Date",
    )) as HTMLInputElement;

    await waitFor(() => {
      expect(dateInput.value).toBe("2026-04-08");
    });
  });

  it("places workout duration before the exercise list", async () => {
    render(
      <WorkoutForm
        initialValues={buildWorkoutDraft()}
        persistMode="update"
        exerciseNames={exerciseNamesFixture}
        workoutId={17}
      />,
    );

    const durationLabel = await screen.findByText("Workout Duration");
    const exercisesLegend = screen.getByText("Exercises");

    expect(
      durationLabel.compareDocumentPosition(exercisesLegend) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("renders workout duration as a compact numeric field", async () => {
    render(
      <WorkoutForm
        initialValues={buildWorkoutDraft()}
        persistMode="update"
        exerciseNames={exerciseNamesFixture}
        workoutId={17}
      />,
    );

    const durationInput = await screen.findByLabelText("Workout Duration");

    expect(durationInput.className).toContain("w-full");
    expect(durationInput.className).toContain("text-center");
  });

  it("groups workout date and duration in a compact metadata row", async () => {
    render(
      <WorkoutForm
        initialValues={buildWorkoutDraft()}
        persistMode="update"
        exerciseNames={exerciseNamesFixture}
        workoutId={17}
      />,
    );

    const dateInput = await screen.findByLabelText("Date");
    const metadataRow = dateInput.closest('[data-slot="field"]')?.parentElement;

    expect(metadataRow?.className).toContain(
      "grid-cols-[minmax(0,1fr)_8rem]",
    );
    expect(metadataRow?.textContent).toContain("Workout Duration");
  });

  it("does not re-fill a cleared create date on rerender with the same seed", async () => {
    vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue(
      "2026-04-06",
    );

    const createProps = {
      initialValues: buildWorkoutDraft({ date: "" }),
      persistMode: "create" as const,
      exerciseNames: exerciseNamesFixture,
    };
    const { rerender } = render(<WorkoutForm {...createProps} />);

    const dateInput = (await screen.findByLabelText(
      "Date",
    )) as HTMLInputElement;

    await waitFor(() => {
      expect(dateInput.value).toBe(new Date().toLocaleDateString("en-CA"));
    });

    fireEvent.change(dateInput, { target: { value: "" } });
    expect(dateInput.value).toBe("");

    rerender(<WorkoutForm {...createProps} />);

    await waitFor(() => {
      expect(dateInput.value).toBe("");
    });
  });

  it("does not submit a duplicate-style create form when date stays blank", async () => {
    vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("");

    const user = userEvent.setup();
    render(
      <WorkoutForm
        initialValues={buildWorkoutDraft({ date: "" })}
        persistMode="create"
        exerciseNames={exerciseNamesFixture}
        templateValuesByExerciseName={{
          "Bench Press": {
            name: "Bench Press",
            notes: "",
            supersetGroupId: null,
            sets: [{ weight: "200", reps: "6", rpe: "7" }],
          },
        }}
      />,
    );

    await screen.findByTestId("exercise-item-0");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Workout date is required");

    const fetchMock = vi.mocked(fetch);
    expect(getWorkoutSaveCalls(fetchMock)).toHaveLength(0);
  });

  it("does not treat inherited toString as a duplicate template", async () => {
    const inheritedTemplateMap = {} as ExerciseTemplateValuesByName;

    render(
      <WorkoutForm
        initialValues={buildWorkoutDraft({
          exercises: [
            {
              name: "toString",
              notes: "",
              supersetGroupId: null,
              sets: [{ weight: "", reps: "", rpe: "" }],
            },
          ],
        })}
        persistMode="create"
        exerciseNames={exerciseNamesFixture}
        templateValuesByExerciseName={inheritedTemplateMap}
      />,
    );

    const exerciseRow = await screen.findByTestId("exercise-item-0");
    expect(exerciseRow.getAttribute("data-has-template")).toBe("false");
  });

  it("uses an own toString duplicate template when provided", async () => {
    const templateValuesByExerciseName = {
      toString: {
        name: "toString",
        notes: "",
        supersetGroupId: null,
        sets: [{ weight: "200", reps: "6", rpe: "7" }],
      },
    } as ExerciseTemplateValuesByName;

    render(
      <WorkoutForm
        initialValues={buildWorkoutDraft({
          exercises: [
            {
              name: "toString",
              notes: "",
              supersetGroupId: null,
              sets: [{ weight: "", reps: "", rpe: "" }],
            },
          ],
        })}
        persistMode="create"
        exerciseNames={exerciseNamesFixture}
        templateValuesByExerciseName={templateValuesByExerciseName}
      />,
    );

    const exerciseRow = await screen.findByTestId("exercise-item-0");
    expect(exerciseRow.getAttribute("data-has-template")).toBe("true");
  });

  it("promotes create mode to update mode in place after the first save", async () => {
    const replaceStateSpy = vi.spyOn(window.history, "replaceState");
    const user = userEvent.setup();

    render(
      <WorkoutForm
        initialValues={workoutDraftFixture}
        persistMode="create"
        exerciseNames={exerciseNamesFixture}
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

    expect(screen.getByText("Not saved")).toBeTruthy();

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

  it("preserves local edits when rerendered with equal-content props", async () => {
    const user = userEvent.setup();
    const createSeed = buildWorkoutDraft();
    const { rerender } = render(
      <WorkoutForm
        initialValues={createSeed}
        persistMode="update"
        exerciseNames={exerciseNamesFixture}
        workoutId={17}
      />,
    );

    await screen.findByTestId("exercise-item-0");
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
        exerciseNames={exerciseNamesFixture}
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
        exerciseNames={exerciseNamesFixture}
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
        exerciseNames={exerciseNamesFixture}
        workoutId={77}
        templateValuesByExerciseName={{
          "Bench Press": {
            name: "Bench Press",
            notes: "",
            supersetGroupId: null,
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
        screen.getByTestId("exercise-item-0").getAttribute("data-workout-id"),
      ).toBe("77");
      expect(
        screen.getByTestId("exercise-item-0").getAttribute("data-has-template"),
      ).toBe("true");
    });
  });

  it("clears stale save failure state when a new external seed arrives", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockImplementation(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? "GET";

        if (url === "/api/workouts" && method === "POST") {
          return createFetchResponse({ error: "bad request" }, { status: 400 });
        }

        throw new Error(`Unexpected fetch request: ${method} ${url}`);
      },
    );

    const user = userEvent.setup();
    const { rerender } = render(
      <WorkoutForm
        initialValues={buildWorkoutDraft()}
        persistMode="create"
        exerciseNames={exerciseNamesFixture}
      />,
    );

    await screen.findByTestId("exercise-item-0");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await screen.findByText("Save failed");

    rerender(
      <WorkoutForm
        initialValues={buildWorkoutDraft({
          name: "Recovered Seed",
        })}
        persistMode="update"
        exerciseNames={exerciseNamesFixture}
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
        exerciseNames={exerciseNamesFixture}
        templateValuesByExerciseName={{
          "Bench Press": {
            name: "Bench Press",
            notes: "",
            supersetGroupId: null,
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
