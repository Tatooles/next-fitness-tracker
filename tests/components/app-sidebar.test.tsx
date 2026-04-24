// @vitest-environment jsdom

import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { SidebarProvider } from "@/components/ui/sidebar";

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

  it("does not expose light or system theme controls", () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>,
    );

    expect(screen.queryByText("Light")).toBeNull();
    expect(screen.queryByText("System")).toBeNull();
    expect(screen.queryByLabelText("Toggle theme")).toBeNull();
  });
});
