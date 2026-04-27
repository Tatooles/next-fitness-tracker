// @vitest-environment jsdom

import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import ExercisesUI from "@/components/exercise/exercises-ui";
import type { ExerciseSummary } from "@/lib/types";

const benchSummary: ExerciseSummary = {
  name: "Bench Press",
  exercises: [
    {
      id: 1,
      name: "Bench Press",
      notes: "",
      workoutId: 1,
      date: "2026-04-01",
      userId: "user-1",
      sets: [{ id: 1, exerciseId: 1, weight: "225", reps: "5", rpe: "8" }],
    },
  ],
};

describe("ExercisesUI", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders exercises when summaries arrive after the first render", () => {
    const { rerender } = render(<ExercisesUI exerciseSummaries={[]} />);

    rerender(<ExercisesUI exerciseSummaries={[benchSummary]} />);

    expect(screen.getByText("Bench Press")).toBeTruthy();
  });
});
