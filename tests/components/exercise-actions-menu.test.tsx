// @vitest-environment jsdom

import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
  }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/exercise/exercise-history-modal", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

import ExerciseActionsMenu from "@/components/workout-form/exercise-actions-menu";

describe("ExerciseActionsMenu", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows the contextual superset actions for an ungrouped middle exercise", () => {
    render(
      <ExerciseActionsMenu
        exerciseName="Bench Press"
        onDelete={() => {}}
        onMoveUp={() => {}}
        onMoveDown={() => {}}
        onStartSupersetWithNext={() => {}}
        onJoinPreviousSuperset={() => {}}
        onRemoveFromSuperset={() => {}}
        isFirst={false}
        isLast={false}
        canStartSupersetWithNext={true}
        canJoinPreviousSuperset={true}
        isInSuperset={false}
      />,
    );

    expect(screen.getByText("Start Superset With Next")).toBeTruthy();
    expect(screen.getByText("Join Previous Superset")).toBeTruthy();
    expect(screen.queryByText("Remove From Superset")).toBeNull();
  });

  it("shows remove from superset for grouped exercises and hides create actions", () => {
    render(
      <ExerciseActionsMenu
        exerciseName="Bench Press"
        onDelete={() => {}}
        onMoveUp={() => {}}
        onMoveDown={() => {}}
        onStartSupersetWithNext={() => {}}
        onJoinPreviousSuperset={() => {}}
        onRemoveFromSuperset={() => {}}
        isFirst={false}
        isLast={false}
        canStartSupersetWithNext={false}
        canJoinPreviousSuperset={false}
        isInSuperset={true}
      />,
    );

    expect(screen.getByText("Remove From Superset")).toBeTruthy();
    expect(screen.queryByText("Start Superset With Next")).toBeNull();
    expect(screen.queryByText("Join Previous Superset")).toBeNull();
  });

  it("calls the matching superset callback when selected", () => {
    const onStartSupersetWithNext = vi.fn();

    render(
      <ExerciseActionsMenu
        exerciseName="Bench Press"
        onDelete={() => {}}
        onMoveUp={() => {}}
        onMoveDown={() => {}}
        onStartSupersetWithNext={onStartSupersetWithNext}
        onJoinPreviousSuperset={() => {}}
        onRemoveFromSuperset={() => {}}
        isFirst={false}
        isLast={false}
        canStartSupersetWithNext={true}
        canJoinPreviousSuperset={false}
        isInSuperset={false}
      />,
    );

    fireEvent.click(screen.getByText("Start Superset With Next"));

    expect(onStartSupersetWithNext).toHaveBeenCalledTimes(1);
  });
});
