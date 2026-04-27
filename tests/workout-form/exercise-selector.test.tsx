// @vitest-environment jsdom

import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExerciseSelector from "@/components/workout-form/exercise-selector";

describe("ExerciseSelector", () => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;
  window.HTMLElement.prototype.scrollIntoView = vi.fn();

  afterEach(() => {
    cleanup();
  });

  async function renderSelector() {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ExerciseSelector
        value=""
        onChange={onChange}
        exercises={["Bench Press", "Overhead Press"]}
      />,
    );

    const trigger = screen.getByTitle("Select exercise");
    await user.click(trigger);

    const input = await screen.findByPlaceholderText("Search or add exercise...");

    return { user, onChange, input, trigger };
  }

  function queryCreateOption(value: string) {
    return (
      screen.queryAllByRole("option", {
        name: `Add "${value}"`,
        hidden: true,
      })[0] ?? null
    );
  }

  it("renders existing exercises and selects one", async () => {
    const { user, onChange } = await renderSelector();

    await user.click(screen.getByText("Bench Press"));

    expect(onChange).toHaveBeenCalledWith("Bench Press");
  });

  it('shows an add option for a non-empty custom value', async () => {
    const { user, input } = await renderSelector();

    await user.type(input, "Romanian Deadlift");

    await waitFor(() => {
      expect(queryCreateOption("Romanian Deadlift")).toBeTruthy();
    });
  });

  it("does not show an add option for whitespace-only input", async () => {
    const { user, input } = await renderSelector();

    await user.type(input, "   ");

    await waitFor(() => {
      expect(queryCreateOption("")).toBeNull();
      expect(
        screen.queryByText((_, node) => {
          return node?.textContent?.startsWith('Add "') ?? false;
        }),
      ).toBeNull();
    });
  });

  it("suppresses add when the typed value matches an existing exercise ignoring case and surrounding spaces", async () => {
    const { user, input } = await renderSelector();

    await user.type(input, " bench press ");

    await waitFor(() => {
      expect(
        screen.queryByText((_, node) => {
          return node?.textContent?.startsWith('Add "') ?? false;
        }),
      ).toBeNull();
    });
  });

  it("shows both partial matches and the add option for non-exact input", async () => {
    const { user, input } = await renderSelector();

    await user.type(input, "Bench");

    expect(await screen.findByText("Bench Press")).toBeTruthy();
    expect(screen.getByText('Add "Bench"')).toBeTruthy();
  });

  it("selecting the add option passes the trimmed custom value", async () => {
    const { user, onChange, input } = await renderSelector();

    await user.type(input, "  Romanian Deadlift  ");
    await waitFor(() => {
      expect(queryCreateOption("Romanian Deadlift")).toBeTruthy();
    });
    await user.click(queryCreateOption("Romanian Deadlift")!);

    expect(onChange).toHaveBeenCalledWith("Romanian Deadlift");
  });

  it("clears the prior search when the popover closes and reopens", async () => {
    const { user, input, trigger } = await renderSelector();

    await user.type(input, "Romanian Deadlift");
    await user.click(trigger);
    await user.click(trigger);

    await screen.findByPlaceholderText("Search or add exercise...");

    await waitFor(() => {
      expect(queryCreateOption("Romanian Deadlift")).toBeNull();
    });
  });

  it("uses a mobile-friendly command surface", async () => {
    await renderSelector();

    const content = document.querySelector('[data-slot="popover-content"]');
    const list = document.querySelector('[data-slot="command-list"]');

    expect(content?.className).toContain("w-[calc(100vw-2rem)]");
    expect(content?.className).toContain(
      "sm:w-[var(--radix-popover-trigger-width)]",
    );
    expect(list?.className).toContain(
      "max-h-[min(calc(100vh-13rem),24rem)]",
    );
  });
});
