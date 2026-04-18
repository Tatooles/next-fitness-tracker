// @vitest-environment jsdom

import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";

vi.mock("@/components/exercise/exercise-instance-item", () => ({
  default: ({
    exercise,
  }: {
    exercise: { workoutName?: string | null; date?: string | null };
  }) => <div>{exercise.workoutName ?? exercise.date}</div>,
}));

vi.mock("@/components/ui/dialog", async () => {
  const React = await import("react");

  const DialogContext = React.createContext<{
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }>({
    open: false,
  });

  return {
    Dialog: ({
      open,
      onOpenChange,
      children,
    }: {
      open: boolean;
      onOpenChange?: (open: boolean) => void;
      children: React.ReactNode;
    }) => (
      <DialogContext.Provider value={{ open, onOpenChange }}>
        <div>{children}</div>
      </DialogContext.Provider>
    ),
    DialogTrigger: ({
      children,
      asChild,
    }: {
      children: React.ReactNode;
      asChild?: boolean;
    }) => {
      const context = React.useContext(DialogContext);

      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
          onClick: () => context.onOpenChange?.(true),
        });
      }

      return (
        <button type="button" onClick={() => context.onOpenChange?.(true)}>
          {children}
        </button>
      );
    },
    DialogContent: ({ children }: { children: React.ReactNode }) => {
      const context = React.useContext(DialogContext);

      if (!context.open) {
        return null;
      }

      return (
        <div>
          {children}
          <button type="button" onClick={() => context.onOpenChange?.(false)}>
            Close dialog
          </button>
        </div>
      );
    },
    DialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogTitle: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

import ExerciseHistoryModal from "@/components/exercise/exercise-history-modal";

describe("ExerciseHistoryModal", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        if (
          String(input) ===
          "/api/exercises/history?name=Bench%20Press%20Cache%20Test"
        ) {
          return new Response(
            JSON.stringify([
              {
                date: "2026-04-04",
                notes: "Filtered out",
                workoutId: 10,
                workoutName: "Filtered Workout",
                sets: [],
              },
              {
                date: "2026-04-02",
                notes: "Keep this one",
                workoutId: 11,
                workoutName: "Visible Workout",
                sets: [],
              },
            ]),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
        }

        throw new Error(`Unexpected fetch request: ${String(input)}`);
      }),
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("revalidates exercise history when the modal is reopened", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              date: "2026-04-04",
              notes: "Filtered out",
              workoutId: 10,
              workoutName: "Filtered Workout",
              sets: [],
            },
            {
              date: "2026-04-02",
              notes: "Keep this one",
              workoutId: 11,
              workoutName: "Visible Workout",
              sets: [],
            },
          ]),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              date: "2026-04-04",
              notes: "Filtered out",
              workoutId: 10,
              workoutName: "Filtered Workout",
              sets: [],
            },
            {
              date: "2026-04-05",
              notes: "Updated history",
              workoutId: 12,
              workoutName: "Newest Workout",
              sets: [],
            },
          ]),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <ExerciseHistoryModal
          exerciseName="Bench Press Cache Test"
          filterOutWorkoutId={10}
        >
          <button type="button">Open history</button>
        </ExerciseHistoryModal>
      </SWRConfig>,
    );

    await user.click(screen.getByRole("button", { name: "Open history" }));

    expect(await screen.findByText("Visible Workout")).toBeTruthy();
    expect(screen.queryByText("Filtered Workout")).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(screen.queryByText("Visible Workout")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Open history" }));

    await waitFor(() => {
      expect(screen.getByText("Newest Workout")).toBeTruthy();
    });
    expect(screen.queryByText("Visible Workout")).toBeNull();
    expect(screen.queryByText("Filtered Workout")).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
