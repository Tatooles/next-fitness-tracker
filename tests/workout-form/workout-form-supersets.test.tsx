// @vitest-environment jsdom

import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { WorkoutDraft } from "@/components/workout-form/form-types";

vi.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: (props: React.ComponentProps<"button">) => (
    <button type="button" {...props}>
      Sidebar
    </button>
  ),
}));

vi.mock("@/components/workout-form/workout-form-header", () => ({
  default: () => <div>Header</div>,
}));

vi.mock("@/components/workout-form/workout-form-action-header", () => ({
  __esModule: true,
  default: () => <div>Action Header</div>,
}));

vi.mock("@/components/workout-form/exercise-item", async () => ({
  default: function MockExerciseItem({
    exerciseName,
    onMoveDown,
    onRemove,
    onRemoveFromSuperset,
  }: {
    exerciseName: string;
    onMoveDown: () => void;
    onRemove: () => void;
    onRemoveFromSuperset: () => void;
  }) {
    return (
      <div data-testid="exercise-item">
        <span>{exerciseName}</span>
        <button type="button" onClick={onMoveDown}>
          move-down-{exerciseName}
        </button>
        <button type="button" onClick={onRemove}>
          delete-{exerciseName}
        </button>
        <button type="button" onClick={onRemoveFromSuperset}>
          remove-from-superset-{exerciseName}
        </button>
      </div>
    );
  },
}));

import WorkoutForm from "@/components/workout-form/workout-form";

const twoExerciseSupersetFixture: WorkoutDraft = {
  name: "Push Day",
  date: "2026-04-18",
  notes: "",
  durationMinutes: 60,
  exercises: [
    {
      name: "Bench Press",
      notes: "",
      supersetGroupId: null,
      sets: [{ weight: "225", reps: "5", rpe: "8" }],
    },
    {
      name: "Arnold Press",
      notes: "",
      supersetGroupId: "superset-a",
      sets: [{ weight: "50", reps: "8", rpe: "8" }],
    },
    {
      name: "Barbell JM Press",
      notes: "",
      supersetGroupId: "superset-a",
      sets: [{ weight: "70", reps: "10", rpe: "9" }],
    },
    {
      name: "Belt Squat",
      notes: "",
      supersetGroupId: null,
      sets: [{ weight: "225", reps: "8", rpe: "8" }],
    },
  ],
};

const threeExerciseSupersetFixture: WorkoutDraft = {
  ...twoExerciseSupersetFixture,
  exercises: [
    {
      name: "Bench Press",
      notes: "",
      supersetGroupId: null,
      sets: [{ weight: "225", reps: "5", rpe: "8" }],
    },
    {
      name: "Arnold Press",
      notes: "",
      supersetGroupId: "superset-a",
      sets: [{ weight: "50", reps: "8", rpe: "8" }],
    },
    {
      name: "Barbell JM Press",
      notes: "",
      supersetGroupId: "superset-a",
      sets: [{ weight: "70", reps: "10", rpe: "9" }],
    },
    {
      name: "Belt Squat",
      notes: "",
      supersetGroupId: "superset-a",
      sets: [{ weight: "225", reps: "8", rpe: "8" }],
    },
  ],
};

describe("WorkoutForm supersets", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders one Superset block for adjacent grouped exercises", () => {
    render(
      <WorkoutForm
        initialValues={twoExerciseSupersetFixture}
        persistMode="create"
        exerciseNames={[
          "Bench Press",
          "Arnold Press",
          "Barbell JM Press",
          "Belt Squat",
        ]}
      />,
    );

    expect(screen.getAllByText("Superset")).toHaveLength(1);
  });

  it("moves the entire superset block when one grouped exercise moves down", () => {
    render(
      <WorkoutForm
        initialValues={twoExerciseSupersetFixture}
        persistMode="create"
        exerciseNames={[
          "Bench Press",
          "Arnold Press",
          "Barbell JM Press",
          "Belt Squat",
        ]}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "move-down-Arnold Press" }),
    );

    expect(
      screen.getAllByTestId("exercise-item").map((node) => node.textContent),
    ).toEqual([
      expect.stringContaining("Bench Press"),
      expect.stringContaining("Belt Squat"),
      expect.stringContaining("Arnold Press"),
      expect.stringContaining("Barbell JM Press"),
    ]);
  });

  it("deletes a grouped exercise without crashing and clears the orphaned superset", () => {
    render(
      <WorkoutForm
        initialValues={twoExerciseSupersetFixture}
        persistMode="update"
        workoutId={251}
        exerciseNames={[
          "Bench Press",
          "Arnold Press",
          "Barbell JM Press",
          "Belt Squat",
        ]}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "delete-Arnold Press" }),
    );

    expect(screen.queryByText("Superset")).toBeNull();
    expect(
      screen.getAllByTestId("exercise-item").map((node) => node.textContent),
    ).toEqual([
      expect.stringContaining("Bench Press"),
      expect.stringContaining("Barbell JM Press"),
      expect.stringContaining("Belt Squat"),
    ]);
  });

  it("removes the middle exercise from a larger superset and clears the split group", () => {
    render(
      <WorkoutForm
        initialValues={threeExerciseSupersetFixture}
        persistMode="update"
        workoutId={250}
        exerciseNames={[
          "Bench Press",
          "Arnold Press",
          "Barbell JM Press",
          "Belt Squat",
        ]}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "remove-from-superset-Barbell JM Press",
      }),
    );

    expect(screen.queryByText("Superset")).toBeNull();
    expect(
      screen.getAllByTestId("exercise-item").map((node) => node.textContent),
    ).toEqual([
      expect.stringContaining("Bench Press"),
      expect.stringContaining("Arnold Press"),
      expect.stringContaining("Barbell JM Press"),
      expect.stringContaining("Belt Squat"),
    ]);
  });
});
