// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import type { MockedFunction } from "vitest";
import type { ReadonlyURLSearchParams } from "next/navigation";
import AnnouncementBanner from "@/components/AnnouncementBanner";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

import { usePathname, useSearchParams } from "next/navigation";

const mockedUsePathname = usePathname as MockedFunction<typeof usePathname>;
const mockedUseSearchParams =
  useSearchParams as MockedFunction<typeof useSearchParams>;

const createSearchParams = (
  created: string | null
): ReadonlyURLSearchParams =>
  ({
    get: () => created,
  }) as ReadonlyURLSearchParams;

describe("AnnouncementBanner", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BANNER_ENABLED", "true");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    cleanup();
  });

  it("renders home banner on root path", () => {
    mockedUsePathname.mockReturnValue("/");
    mockedUseSearchParams.mockReturnValue(createSearchParams(null));

    render(<AnnouncementBanner />);

    expect(
      screen.getByText(/Selamat datang di Lifting Log/i)
    ).toBeTruthy();
  });

  it("renders success banner after workout created", () => {
    mockedUsePathname.mockReturnValue("/workouts");
    mockedUseSearchParams.mockReturnValue(createSearchParams("true"));

    render(<AnnouncementBanner />);

    expect(
      screen.getByText(/Workout berhasil ditambahkan/i)
    ).toBeTruthy();
  });

  it("dismisses banner when close button clicked", () => {
    mockedUsePathname.mockReturnValue("/");
    mockedUseSearchParams.mockReturnValue(createSearchParams(null));

    render(<AnnouncementBanner />);

    fireEvent.click(screen.getByLabelText(/dismiss banner/i));

    expect(
      screen.queryByText(/Selamat datang di Lifting Log/i)
    ).toBeNull();
  });
});