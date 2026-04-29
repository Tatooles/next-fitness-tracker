// @vitest-environment jsdom

import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import FormSets from "@/components/workout-form/form-sets";
import type { WorkoutDraft } from "@/components/workout-form/form-types";

const workoutDraftFixture: WorkoutDraft = {
  name: "Push Day",
  date: "2026-04-27",
  notes: "",
  durationMinutes: 60,
  exercises: [
    {
      name: "Bench Press",
      notes: "",
      supersetGroupId: null,
      sets: [
        { weight: "225", reps: "5", rpe: "8" },
        { weight: "215", reps: "6", rpe: "8.5" },
      ],
    },
  ],
};

function FormSetsHarness() {
  const form = useForm<WorkoutDraft>({
    defaultValues: workoutDraftFixture,
  });

  return (
    <FormSets
      exerciseIndex={0}
      control={form.control}
      getValues={form.getValues}
    />
  );
}

describe("FormSets UI", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders set rows with visible numbers and accessible field labels", () => {
    render(<FormSetsHarness />);

    expect(screen.getByText("Set")).toBeTruthy();
    expect(screen.getByText("Weight")).toBeTruthy();
    expect(screen.getByText("Reps")).toBeTruthy();
    expect(screen.getByText("RPE")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();

    expect(screen.getByLabelText("Set 1 weight")).toBeTruthy();
    expect(screen.getByLabelText("Set 1 reps")).toBeTruthy();
    expect(screen.getByLabelText("Set 1 RPE")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Delete set 1" })).toBeTruthy();
  });
});
