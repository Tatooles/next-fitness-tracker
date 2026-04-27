# Dark Red UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert Lifting Log into a dark-only, high-contrast UI with darker red accents while preserving existing routes and workout workflows.

**Architecture:** Keep the current Next.js App Router and shadcn-style component structure. Apply the design through global tokens, shared UI primitives, and targeted screen-level class updates rather than changing data flow or route behavior.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Radix UI primitives, next-themes, Clerk, Vitest, Testing Library.

---

## File Structure

- Modify `tests/components/app-sidebar.test.tsx`: cover that the sidebar no longer exposes a theme toggle.
- Modify `tests/components/theme-provider.test.tsx`: cover that the theme provider forces dark mode.
- Modify `components/theme-provider.tsx`: force dark mode through `next-themes`.
- Modify `components/app-sidebar.tsx`: remove theme toggle usage and restyle the brand/user footer.
- Modify `components/theme-toggle.tsx`: remove light/system choices or leave unused with dark-only behavior.
- Modify `styles/globals.css`: replace light/dark token split with one dark red token system and add app-wide polish utilities.
- Modify `app/layout.tsx`: set dark metadata color and simplify provider props.
- Modify `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/input.tsx`, `components/ui/textarea.tsx`, `components/ui/accordion.tsx`, `components/ui/sidebar.tsx`: align shared primitives with the dark-only visual system.
- Modify `app/page.tsx`, `app/workouts/page.tsx`, `components/workouts.tsx`, `app/exercises/page.tsx`, `components/exercise/exercises-ui.tsx`, `components/exercise/exercise-summary.tsx`, `components/exercise/exercise-instance-item.tsx`, `components/workout-form/workout-form.tsx`, `components/workout-form/workout-form-header.tsx`, `components/workout-form/workout-form-action-header.tsx`, `components/workout-form/exercise-item.tsx`, `components/workout-form/form-sets.tsx`, `app/export/page.tsx`: apply the high-contrast minimal screen treatment.

### Task 1: Dark-Only Theme Behavior

**Files:**

- Modify: `tests/components/app-sidebar.test.tsx`
- Create: `tests/components/theme-provider.test.tsx`
- Modify: `components/theme-provider.tsx`
- Modify: `components/app-sidebar.tsx`
- Modify: `components/theme-toggle.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add failing tests for dark-only behavior**

Add a test in `tests/components/app-sidebar.test.tsx` that renders `AppSidebar` and asserts the "Toggle theme" control is absent.

Create `tests/components/theme-provider.test.tsx` with this behavior:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeProvider } from "@/components/theme-provider";

describe("ThemeProvider", () => {
  it("renders children while forcing the app into dark mode", () => {
    render(
      <ThemeProvider>
        <div>Dark-only app</div>
      </ThemeProvider>,
    );

    expect(screen.getByText("Dark-only app")).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("dark");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test tests/components/app-sidebar.test.tsx tests/components/theme-provider.test.tsx`

Expected: at least one failure because the sidebar still renders the theme toggle and the current provider does not force the document class to `dark` during the test.

- [ ] **Step 3: Implement dark-only behavior**

Update `ThemeProvider` to force dark mode and set `document.documentElement.classList.add("dark")` on mount for deterministic rendering. Remove `ThemeToggle` from `AppSidebar`. Keep `components/theme-toggle.tsx` dark-only if retained, so no light/system options remain.

Update `app/layout.tsx` so `ThemeProvider` no longer receives `defaultTheme="system"` or `enableSystem`, and set viewport theme colors to the dark background.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test tests/components/app-sidebar.test.tsx tests/components/theme-provider.test.tsx`

Expected: PASS.

### Task 2: Global Tokens and Shared Primitives

**Files:**

- Modify: `styles/globals.css`
- Modify: `components/ui/button.tsx`
- Modify: `components/ui/card.tsx`
- Modify: `components/ui/input.tsx`
- Modify: `components/ui/textarea.tsx`
- Modify: `components/ui/accordion.tsx`
- Modify: `components/ui/sidebar.tsx`

- [ ] **Step 1: Update the global dark token system**

Set `:root` and `.dark` to the same dark values for `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, and sidebar tokens. Use near-black backgrounds, charcoal cards, dark red primary/accent/ring, and off-white foreground.

- [ ] **Step 2: Restyle shared primitives**

Update buttons so `default` is dark red, `outline` is charcoal with restrained borders, `secondary` is neutral charcoal, `ghost` has subtle charcoal hover, and `destructive` uses the red destructive token.

Update cards, inputs, textarea, accordion items, and sidebar surfaces with compact radii, visible dark borders, subtle shadows, and no light-only classes.

- [ ] **Step 3: Run focused component tests**

Run: `pnpm test tests/components/app-sidebar.test.tsx tests/components/workouts.test.tsx tests/components/exercise-history-modal.test.tsx`

Expected: PASS.

### Task 3: App Shell and Core Screens

**Files:**

- Modify: `components/app-sidebar.tsx`
- Modify: `app/page.tsx`
- Modify: `app/workouts/page.tsx`
- Modify: `components/workouts.tsx`
- Modify: `app/exercises/page.tsx`
- Modify: `components/exercise/exercises-ui.tsx`
- Modify: `components/exercise/exercise-summary.tsx`
- Modify: `components/exercise/exercise-instance-item.tsx`
- Modify: `app/export/page.tsx`

- [ ] **Step 1: Polish the sidebar shell**

Make the brand more deliberate, add active-capable dark styling through sidebar tokens, remove the theme toggle from the footer, and keep the Clerk user control.

- [ ] **Step 2: Replace the home page with a practical start screen**

Keep routes to workouts and exercises. Use compact dark panels and action-oriented text instead of the current centered marketing-style cards.

- [ ] **Step 3: Restyle workouts and exercises**

Use consistent page headers, compact metadata, dark accordion rows, dark detail panels, neutral secondary actions, red primary/destructive actions, and red/charcoal stat chips.

- [ ] **Step 4: Restyle export actions**

Replace the bright Excel/CSV colors with dark panel actions that match the rest of the app.

- [ ] **Step 5: Run focused route/component tests**

Run: `pnpm test tests/components/workouts.test.tsx tests/components/exercise-history-modal.test.tsx tests/routes/export-route.test.ts`

Expected: PASS.

### Task 4: Workout Form Polish

**Files:**

- Modify: `components/workout-form/workout-form.tsx`
- Modify: `components/workout-form/workout-form-header.tsx`
- Modify: `components/workout-form/workout-form-action-header.tsx`
- Modify: `components/workout-form/exercise-item.tsx`
- Modify: `components/workout-form/form-sets.tsx`

- [ ] **Step 1: Restyle the sticky action header**

Keep save status behavior unchanged. Make the header a dark translucent bar, make Save a red primary action, and convert status pills to dark-compatible colors.

- [ ] **Step 2: Restyle workout metadata inputs**

Use dark filled inputs, compact labels, red focus states through shared tokens, and consistent spacing.

- [ ] **Step 3: Restyle exercise and set panels**

Use charcoal cards, structured set rows, neutral clone/add buttons, red remove affordances, and red-tinted superset blocks. Preserve fixed input widths and mobile layout stability.

- [ ] **Step 4: Run workout form tests**

Run: `pnpm test tests/workout-form/exercise-selector.test.tsx tests/workout-form/workout-form-promotion.test.tsx tests/workout-form/workout-form-supersets.test.tsx tests/workout-form/save-workout.test.ts`

Expected: PASS.

### Task 5: Full Verification

**Files:**

- No production edits expected unless verification finds issues.

- [ ] **Step 1: Run static and automated checks**

Run:

```bash
pnpm lint
pnpm test
pnpm build
```

Expected: all commands pass.

- [ ] **Step 2: Start the app**

Run: `pnpm dev`

Expected: Next.js dev server starts and reports a local URL.

- [ ] **Step 3: Browser verification**

Open the local URL and verify:

- Home page is dark-only and polished.
- Sidebar has no light/system toggle.
- Workouts page uses dark accordion rows and red primary action.
- Exercises page search/list/stats are readable.
- Workout form remains usable at desktop and mobile widths.

- [ ] **Step 4: Final git review**

Run: `git status --short` and `git diff --stat`.

Expected: only planned files are changed.
