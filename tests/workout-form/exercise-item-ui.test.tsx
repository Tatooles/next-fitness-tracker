// @vitest-environment jsdom

import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import ExerciseItem from "@/components/workout-form/exercise-item";
import type { WorkoutDraft } from "@/components/workout-form/form-types";

vi.mock("@/components/workout-form/exercise-selector", () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
    exercises: string[];
  }) => (
    <button type="button" onClick={() => onChange("Overhead Press")}>
      {value || "Select exercise"}
    </button>
  ),
}));

vi.mock("@/components/workout-form/exercise-actions-menu", () => ({
  default: ({
    exerciseName,
    onChangeExercise,
  }: {
    exerciseName: string;
    onChangeExercise?: () => void;
  }) => (
    <button type="button" onClick={onChangeExercise}>
      Actions for {exerciseName}
    </button>
  ),
}));

const workoutDraftFixture: WorkoutDraft = {
  name: "Push Day",
  date: "2026-04-27",
  notes: "",
  durationMinutes: 60,
  exercises: [
    {
      name: "Bench Press",
      notes: "Pause the first rep",
      supersetGroupId: null,
      sets: [{ weight: "225", reps: "5", rpe: "8" }],
    },
  ],
};

function ExerciseItemHarness() {
  const form = useForm<WorkoutDraft>({
    defaultValues: workoutDraftFixture,
  });

  return (
    <ExerciseItem
      index={0}
      control={form.control}
      getValues={form.getValues}
      exercises={["Bench Press", "Overhead Press"]}
      exerciseName="Bench Press"
      onRemove={() => {}}
      onMoveUp={() => {}}
      onMoveDown={() => {}}
      onStartSupersetWithNext={() => {}}
      onJoinPreviousSuperset={() => {}}
      onRemoveFromSuperset={() => {}}
      isFirst={true}
      isLast={true}
      canStartSupersetWithNext={false}
      canJoinPreviousSuperset={false}
      isInSuperset={false}
    />
  );
}

describe("ExerciseItem UI", () => {
  afterEach(() => {
    cleanup();
  });

  it("gives selected exercises a scannable card heading", () => {
    render(<ExerciseItemHarness />);

    expect(
      screen.getByRole("heading", { name: "Bench Press" }),
    ).toBeTruthy();
  });

  it("hides the selector for named exercises until the action menu requests it", () => {
    render(<ExerciseItemHarness />);

    expect(screen.queryByRole("button", { name: "Bench Press" })).toBeNull();

    fireEvent.click(
      screen.getByRole("button", { name: "Actions for Bench Press" }),
    );

    expect(screen.getByRole("button", { name: "Bench Press" })).toBeTruthy();
  });

  it("replaces the exercise heading with the selector when changing exercise", () => {
    render(<ExerciseItemHarness />);

    fireEvent.click(
      screen.getByRole("button", { name: "Actions for Bench Press" }),
    );

    expect(screen.queryByRole("heading", { name: "Bench Press" })).toBeNull();
    expect(screen.getByRole("button", { name: "Bench Press" })).toBeTruthy();
  });
});
