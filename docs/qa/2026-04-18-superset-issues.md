# Superset QA Findings

Date: 2026-04-18
Environment: local app on `localhost:3000`, exercised in `Helium`

## Summary

Manual QA covered workout creation, edit, save, detail rendering, clipboard copy, and a subset of mutation flows for the new superset support.

## Confirmed Passes

- Creating a superset from the workout form works.
- Joining an existing superset from the next exercise works.
- Removing the middle member from a 3-exercise superset correctly clears the split group.
- After the middle-removal flow, the preceding exercise regains `Start Superset With Next`.
- Saved workout details render a single `Superset` block for contiguous grouped exercises.
- Clipboard copy emits one `Superset` heading before grouped exercises.
- Moving a grouped exercise down moves the whole contiguous block.

## Confirmed Failures

### Delete From Persisted Superset Can Crash Edit Form

Reproduction:

1. Open a saved workout in edit mode.
2. Create or load a persisted 2-exercise superset.
3. Open the exercise actions menu on one grouped exercise.
4. Choose `Delete Exercise`.

Observed result:

- The edit page crashes with `TypeError: Cannot read properties of undefined (reading 'id')`.
- The stack trace points to `components/workout-form/workout-form.tsx` during grouped block rendering.

Notes:

- This was reproduced against a live saved workout.
- The failure happens after save/reload, so it is not limited to unsaved draft state.

## Coverage Gaps Identified During QA

- No automated component regression covering `Delete Exercise` for a grouped exercise in the persisted grouped render path.
- No automated UI-level regression covering `Remove From Superset` on a larger saved group.
- Export coverage exists, but the assertions should verify ordering and heading placement more explicitly.

## Follow-Up

- Add focused regression tests for grouped delete and remove flows.
- Fix the grouped render/delete bug in `WorkoutForm`.
- Re-run focused browser QA after the regression is covered automatically.
