// @vitest-environment jsdom

import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";

vi.mock("next/link", () => ({
  default: (
    props: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
      prefetch?: boolean;
    },
  ) => {
    const { href, children, prefetch, ...anchorProps } = props;
    void prefetch;

    return (
      <a href={href} {...anchorProps}>
        {children}
      </a>
    );
  },
}));

vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <button type="button">User menu</button>,
  useUser: () => ({
    user: {
      fullName: "Kevin Tester",
      username: "kevintester",
      primaryEmailAddress: {
        emailAddress: "kevin@example.com",
      },
    },
  }),
}));

import { AppSidebar } from "@/components/app-sidebar";

describe("AppSidebar", () => {
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
    vi.restoreAllMocks();
  });

  it("exposes light, system, and dark theme controls", () => {
    render(
      <ThemeProvider>
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </ThemeProvider>,
    );

    expect(screen.getByLabelText("Light theme")).toBeTruthy();
    expect(screen.getByLabelText("System theme")).toBeTruthy();
    expect(screen.getByLabelText("Dark theme")).toBeTruthy();
  });
});
