// @vitest-environment jsdom

import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import type { Workout, WorkoutSummary } from "@/lib/types";

const { copyWorkoutToClipboardMock, refreshMock } = vi.hoisted(() => ({
  copyWorkoutToClipboardMock: vi.fn(),
  refreshMock: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

vi.mock("@/components/ui/button", async () => {
  const React = await import("react");

  return {
    Button: ({
      asChild,
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
      asChild?: boolean;
      children: React.ReactNode;
    }) => {
      if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, props);
      }

      return (
        <button type="button" {...props}>
          {children}
        </button>
      );
    },
  };
});

vi.mock("@/components/ui/accordion", async () => {
  const React = await import("react");

  const AccordionContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
  }>({});
  const AccordionItemContext = React.createContext<string>("");

  return {
    Accordion: ({
      value,
      onValueChange,
      children,
    }: {
      value?: string;
      onValueChange?: (value: string) => void;
      children: React.ReactNode;
    }) => (
      <AccordionContext.Provider value={{ value, onValueChange }}>
        <div>{children}</div>
      </AccordionContext.Provider>
    ),
    AccordionItem: ({
      value,
      children,
    }: {
      value: string;
      children: React.ReactNode;
    }) => (
      <AccordionItemContext.Provider value={value}>
        <div>{children}</div>
      </AccordionItemContext.Provider>
    ),
    AccordionTrigger: ({ children }: { children: React.ReactNode }) => {
      const accordion = React.useContext(AccordionContext);
      const itemValue = React.useContext(AccordionItemContext);

      return (
        <button
          type="button"
          onClick={() =>
            accordion.onValueChange?.(
              accordion.value === itemValue ? "" : itemValue,
            )
          }
        >
          {children}
        </button>
      );
    },
    AccordionContent: ({ children }: { children: React.ReactNode }) => {
      const accordion = React.useContext(AccordionContext);
      const itemValue = React.useContext(AccordionItemContext);

      return accordion.value === itemValue ? <div>{children}</div> : null;
    },
  };
});

vi.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogCancel: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  AlertDialogAction: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/loading-overlay", () => ({
  LoadingOverlay: ({ isLoading }: { isLoading: boolean }) =>
    isLoading ? <div data-testid="loading-overlay">Loading</div> : null,
}));

vi.mock("@/components/exercise/exercise-instance-item", () => ({
  default: ({ exercise }: { exercise: { name: string } }) => (
    <div>{exercise.name} detail</div>
  ),
}));

vi.mock("@/lib/workout-utils", () => ({
  copyWorkoutToClipboard: copyWorkoutToClipboardMock,
}));

import Workouts from "@/components/workouts";

const workoutSummaryFixture: WorkoutSummary[] = [
  {
    id: 1,
    name: "Push Day",
    notes: "Top sets only",
    durationMinutes: 60,
    date: "2026-04-01",
  },
];

const workoutDetailsFixture: Workout = {
  id: 1,
  userId: "user-1",
  name: "Push Day",
  notes: "Top sets only",
  durationMinutes: 60,
  date: "2026-04-01",
  exercises: [
    {
      id: 10,
      name: "Bench Press",
      notes: "Paused",
      workoutId: 1,
      sets: [{ id: 100, exerciseId: 10, weight: "225", reps: "5", rpe: "8" }],
    },
  ],
};

describe("Workouts", () => {
  beforeEach(() => {
    refreshMock.mockReset();
    copyWorkoutToClipboardMock.mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        if (String(input) === "/api/workouts/1") {
          return new Response(JSON.stringify(workoutDetailsFixture), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          });
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

  it("revalidates workout details when the accordion is reopened", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(
        new Response(JSON.stringify(workoutDetailsFixture), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            ...workoutDetailsFixture,
            exercises: [
              {
                ...workoutDetailsFixture.exercises[0],
                id: 11,
                name: "Incline Press",
              },
            ],
          } satisfies Workout),
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
        <Workouts workouts={workoutSummaryFixture} />
      </SWRConfig>,
    );

    const trigger = screen.getByRole("button", { name: /Push Day/i });
    await user.click(trigger);

    expect(await screen.findByText("Bench Press detail")).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.click(trigger);
    expect(screen.queryByText("Bench Press detail")).toBeNull();

    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByText("Incline Press detail")).toBeTruthy();
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
