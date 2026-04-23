# Dark Red UI Redesign Design

## Goal

Redesign Lifting Log as a dark-only, high-contrast training log with a darker red accent. The app should feel more modern and polished while preserving the current navigation, routes, data model, and workout logging workflows.

## Direction

Use the approved "High-Contrast Minimal" direction:

- Dark-only UI with no light/system presentation mode.
- Black-first page background with slightly lifted panels for cards, accordions, forms, popovers, and dialogs.
- Dark red for primary actions, active navigation, focus rings, selected states, and destructive emphasis where appropriate.
- Neutral grays for secondary actions and dense data surfaces.
- Compact spacing and clear hierarchy for repeated workout/exercise logging.
- No decorative gradients, blobs, or marketing-style hero treatment.

## Scope

Update these areas:

- Global Tailwind/shadcn tokens in `styles/globals.css`.
- Root layout metadata/theme color in `app/layout.tsx`.
- Theme handling in `components/theme-provider.tsx` and removal of user-facing light/system controls in `components/theme-toggle.tsx` or sidebar usage.
- App shell/sidebar in `components/app-sidebar.tsx` and existing sidebar primitives as needed.
- Home, workouts, exercises, workout detail, and workout form surfaces.
- Shared UI primitives where broad polish is safer than one-off class overrides: buttons, cards, inputs, textarea, accordions, dialogs, popovers, dropdowns, and sheets.

Out of scope:

- New analytics, charts, generated stats, or data model changes.
- Route or workflow changes.
- Authentication behavior changes.
- Replacing the component library.

## UI System

The app will use one dark token set instead of maintaining a separate light palette. Core surfaces:

- Background: near-black.
- Card/popover/sidebar: dark charcoal.
- Muted/secondary: low-contrast charcoal.
- Border/input: visible but restrained gray.
- Primary/accent/ring: dark red.
- Foreground: warm off-white.
- Muted foreground: neutral gray.

Buttons will keep their existing variants, but primary buttons should read as dark red. Outline and ghost buttons should feel integrated into dark surfaces. Destructive buttons should remain clearly destructive without introducing a separate bright theme.

## Screen Design

Home:

- Replace the current centered marketing-style intro with a practical app start screen.
- Keep two primary destinations: workouts and exercises.
- Use compact panels and action-oriented copy rather than large hero cards.

Workouts:

- Keep the existing max-width list workflow.
- Restyle the page header, create button, accordion rows, details, notes, and action buttons.
- Remove bright multicolor action borders in favor of neutral buttons with icon semantics and red emphasis for primary/destructive actions.

Exercises:

- Restyle search, accordion rows, summary stats, and history entry points.
- Keep last-performed metadata visible and scannable.

Workout form:

- Preserve the current form model and autosave/status behavior.
- Restyle header controls, exercise panels, set inputs, duration block, superset blocks, and add/clone actions.
- Keep mobile ergonomics intact with fixed-size numeric fields and no layout shifts.

## Behavior

The app should always render dark. The theme toggle should no longer expose light/system choices. If the existing theme provider remains for hydration compatibility, it should force dark mode.

No user data behavior changes are expected.

## Testing

Run:

- `pnpm lint`
- `pnpm test`
- `pnpm build`

Also run a visual verification pass in the browser for:

- Home page.
- Workouts list and expanded workout.
- Exercises list.
- Create/edit workout form.
- Mobile-width layout for the form and navigation.

## Acceptance Criteria

- The app no longer presents a light mode option.
- The UI is dark by default and dark after reload.
- Red is the main accent for primary action, focus, active, and destructive states.
- Major screens share the same surface, border, spacing, and typography treatment.
- Existing tests continue passing.
- No data model or route behavior changes are introduced.
