// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

import { ThemeProvider } from "@/components/theme-provider";

describe("ThemeProvider", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    cleanup();
    document.documentElement.className = "";
    vi.restoreAllMocks();
  });

  it("renders children while forcing the app into dark mode", async () => {
    render(
      <ThemeProvider>
        <div>Dark-only app</div>
      </ThemeProvider>,
    );

    expect(screen.getByText("Dark-only app")).toBeTruthy();
    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });
});
