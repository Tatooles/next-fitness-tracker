# Workout Form Cleanup And Save UX Refactor Plan

## Summary
Refactor the workout form into a single long-lived client form with explicit persistence modes, shared server seed builders, narrower render subscriptions, and a no-page-turn create/duplicate save flow. The implementation is staged so each step is independently shippable, with architecture cleanup first, UX improvement second, and performance/testing follow-ups after the new shape is stable.

## Assumptions And Defaults
- “Duplicate” is not a separate persistence path. It is a seeded create flow that uses `POST` on first save.
- After the first successful create/duplicate save, the current mounted form should remain on screen and become an edit/update form locally.
- The URL should update to `/workouts/edit/:id` without a visible route transition. Use `window.history.replaceState(...)`, not `router.push(...)` or `router.replace(...)`.
- Existing API routes remain in place: `POST /api/workouts` and `PATCH /api/workouts/:id`.
- The current destructive `PATCH` rewrite strategy remains for this refactor; diff-based updates are a later follow-up.
- Testing uses Vitest, matching the existing route test setup in [tests/routes/workouts-routes.test.ts](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/tests/routes/workouts-routes.test.ts).

## Public API / Interface / Type Changes
- Replace `WorkoutFormProps` in [workout-form.tsx](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/components/workout-form/workout-form.tsx) from:
  - `editMode: boolean`
  - `workoutId: number`
  - `workoutValue: TWorkoutFormSchema`
  - `placeholderValues?: ExerciseThin[]`
- With a decision-complete prop contract:
  - `initialValues: WorkoutDraft`
  - `persistMode: "create" | "update"`
  - `workoutId?: number`
  - `templateValuesByExerciseName?: Record<string, ExerciseTemplateHint>`
- Introduce explicit client types in a shared form-model module:
  - `type WorkoutDraft = TWorkoutFormSchema`
  - `type ExerciseTemplateHint = ExerciseThin`
  - `type WorkoutFormSeed = { initialValues: WorkoutDraft; persistMode: "create" | "update"; workoutId?: number; templateValuesByExerciseName?: Record<string, ExerciseTemplateHint> }`
  - `type SaveState = "idle" | "saving" | "saved" | "failed"`
- Add shared server helper interfaces:
  - `buildWorkoutFormSeed({ kind: "create" | "edit" | "duplicate"; workoutId?: number }): Promise<WorkoutFormSeed | null>`
- Add shared client save helper interface:
  - `saveWorkout({ persistMode, workoutId, values }): Promise<{ ok: true; workoutId: number } | { ok: false }>`

## Ordered Implementation Steps

### 1. Model form persistence explicitly
Create a shared form model module that defines `WorkoutDraft`, `WorkoutFormSeed`, `ExerciseTemplateHint`, and `SaveState`. Replace boolean `editMode` semantics with `persistMode: "create" | "update"` everywhere the form is invoked.

**Implementation details**
- Put the shared types and seed builders in a dedicated module under `components/workout-form` or `lib`.
- Keep `duplicate` as a route-level seed choice, not a form-level persistence mode.

**Acceptance criteria**
- No component uses `editMode`.
- No component passes `workoutId={-1}`.
- The form can distinguish “first save uses POST” vs “subsequent saves use PATCH” without sentinel values.

---

### 2. Extract shared server-side seed builders
Move create/edit/duplicate data shaping out of route pages into one server helper. That helper returns a `WorkoutFormSeed` for all three entry points.

**Implementation details**
- Create one loader that encapsulates auth, ownership checks, workout query, and conversion into `WorkoutDraft`.
- Create one transform for blank create.
- Create one transform for edit.
- Create one transform for duplicate that:
  - sets the copied workout name
  - sets today’s date using one shared helper
  - clears notes and duration
  - clears set values in `initialValues`
  - preserves prior set values in `templateValuesByExerciseName`

**Acceptance criteria**
- [app/workouts/(form)/create/page.tsx](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/app/workouts/(form)/create/page.tsx), [app/workouts/(form)/edit/[id]/page.tsx](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/app/workouts/(form)/edit/[id]/page.tsx), and [app/workouts/(form)/duplicate/[id]/page.tsx](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/app/workouts/(form)/duplicate/[id]/page.tsx) become thin wrappers around the shared helper.
- Edit and duplicate no longer duplicate auth/query/transform logic.
- The create and duplicate flows use the same “today” defaulting logic.

---

### 3. Unify client save logic behind one abstraction
Replace `createWorkout` and `updateWorkout` with one save layer that branches internally based on `persistMode`.

**Implementation details**
- Add a dedicated `saveWorkout` helper or `useWorkoutSave` hook in the form area.
- Keep shared fetch setup, headers, error handling, and response parsing in one place.
- Return normalized results:
  - create returns the new `workoutId`
  - update returns the existing `workoutId`
- Keep toast behavior centralized in the save layer.

**Acceptance criteria**
- `onSubmit` has one save call, not separate POST/PATCH branches.
- Save failure handling does not depend on object identity.
- The form code clearly separates “save” from “what to do after save”.

---

### 4. Eliminate the page turn after create or duplicate save
After a successful create/duplicate `POST`, keep the current form mounted, promote it into update mode locally, and replace the URL without a route transition.

**Implementation details**
- On successful first save:
  - store returned `workoutId` in local state
  - switch local `persistMode` from `"create"` to `"update"`
  - call `reset(submittedValues)` to clear dirty state
  - clear duplicate-only template hints if they are no longer needed
  - call `window.history.replaceState(window.history.state, "", \`/workouts/edit/${workoutId}\`)`
- Do not call `router.push(...)` after create.
- Keep the form header/status mounted through the transition.

**Acceptance criteria**
- Saving in create or duplicate mode does not visibly navigate away or remount the page.
- After first save, subsequent saves use `PATCH`.
- Refreshing the browser after first save lands on the canonical edit route.

---

### 5. Switch RHF ownership to `defaultValues + reset`
Stop using `useForm({ values })` and let RHF own form state after mount.

**Implementation details**
- Initialize the form with `defaultValues: normalizedInitialValues`.
- Use a controlled `useEffect` + `reset(...)` only when the input seed intentionally changes.
- Keep normalization in one place before RHF initialization.

**Acceptance criteria**
- [workout-form.tsx](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/components/workout-form/workout-form.tsx) no longer passes `values` into `useForm`.
- Dirty state behaves predictably before and after save.
- The form does not need prop-identity tricks to preserve user input.

---

### 6. Replace token-based save failure logic with explicit save state
Remove `failedWorkoutValueToken` and the subscription-based failure reset behavior. Use a simple explicit save state and last-success flow.

**Implementation details**
- Track `saveState: "idle" | "saving" | "saved" | "failed"`.
- Derive the header badge from `persistMode`, `isDirty`, and `saveState`.
- On input changes after a failed save, clear only the `failed` state, not the form itself.
- Do not subscribe to form events just to clear save errors.

**Acceptance criteria**
- [workout-form.tsx](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/components/workout-form/workout-form.tsx) no longer compares form objects for failure state.
- Save status logic is readable from state alone.
- The save-status header still shows correct behavior for create, duplicate, edit, saving, saved, and failed states.

---

### 7. Move exercise-name watching to row scope
Remove the root `useWatch("exercises")` and watch only the exercise name required by each row.

**Implementation details**
- Move `useWatch({ name: \`exercises.${index}.name\` })` into [exercise-item.tsx](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/components/workout-form/exercise-item.tsx).
- Pass only stable props from the parent list.
- Keep `useFieldArray` at the root for exercise rows.

**Acceptance criteria**
- [workout-form.tsx](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/components/workout-form/workout-form.tsx) no longer watches the entire exercise array.
- Editing a set in one exercise does not rerender all exercise rows just to update row names.
- Exercise actions and placeholder logic still receive the correct current exercise name.

---

### 8. Precompute duplicate placeholder lookup data
Stop doing repeated `placeholderValues?.find(...)` calls inside each set field render.

**Implementation details**
- Build `templateValuesByExerciseName` once in the server seed helper or once in the form component with `useMemo`.
- Pass the matched template exercise directly into [form-sets.tsx](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/components/workout-form/form-sets.tsx) for the current row.
- Preserve current behavior where duplicate shows prior set values only as placeholders.

**Acceptance criteria**
- [form-sets.tsx](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/components/workout-form/form-sets.tsx) does not search the full placeholder array from each input render.
- Duplicate placeholders still match the selected exercise and set index correctly.
- The new placeholder prop shape is direct and row-local.

---

### 9. Replace unnecessary `Controller` usage with `register`
Reduce RHF overhead by using `register` for plain text, textarea, and number inputs, while keeping `Controller` for controlled widgets like the exercise selector.

**Implementation details**
- Keep `Controller` for:
  - exercise selector
  - any field that requires value transformation beyond native input behavior
- Convert straightforward inputs in:
  - [workout-form-header.tsx](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/components/workout-form/workout-form-header.tsx)
  - [form-sets.tsx](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/components/workout-form/form-sets.tsx)
  - duration field in [workout-form.tsx](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/components/workout-form/workout-form.tsx)
- For `durationMinutes`, use RHF’s supported transformation approach consistently so `null` remains valid.

**Acceptance criteria**
- Most plain inputs use `register`.
- The selector still works as a controlled component.
- Validation and error rendering remain unchanged from the user’s perspective.

---

### 10. Centralize “today” date defaulting
Create one helper for “today in workout date format” and use it in both blank create and duplicate seed generation.

**Implementation details**
- Put the helper in the shared form model/seed module.
- Use the same date source and formatting rule for all create-like flows.
- Do not keep separate client and server implementations.

**Acceptance criteria**
- There is one canonical helper for default workout dates.
- Blank create and duplicate generate the same date for the same request context.
- No route or component computes its own “today” string ad hoc.

---

### 11. Improve exercise options loading
Move exercise-name fetching out of the form-mount effect and into a shared, predictable data-loading path.

**Implementation details**
- Preferred approach: load exercise names on the server alongside the form seed and pass them as props.
- If server loading is not practical in the same pass, add a cached client fetch layer with explicit error handling.
- Do not leave raw `fetch("/api/exercises")` in a mount-only effect without response checks.

**Acceptance criteria**
- The form does not issue an uncached “fire and forget” exercise-options request on every mount.
- Error handling is explicit.
- Exercise selector options are available consistently across create, edit, and duplicate.

---

### 12. Add focused tests for seed building, save promotion, and status transitions
Expand test coverage around the new form architecture instead of only testing route handlers.

**Implementation details**
- Add Vitest unit tests for the shared seed builder:
  - blank create seed
  - edit seed
  - duplicate seed
  - duplicate placeholder generation
  - today-date helper behavior
- Add component or hook tests for the client save flow:
  - create success promotes to update mode
  - URL is replaced without push navigation
  - subsequent save uses update mode
  - failed save sets `failed` state
  - successful save resets dirty state
- Keep existing route tests in [tests/routes/workouts-routes.test.ts](/Users/kevintatooles/Desktop/Projects/next-fitness-tracker/tests/routes/workouts-routes.test.ts).

**Acceptance criteria**
- New unit tests cover seed generation for all entry modes.
- New client-side tests cover save promotion and status transitions.
- Existing route tests still pass unchanged or with minimal fixture updates.

---

### 13. Track a follow-up for diff-based PATCH updates
Keep the current full rewrite update strategy for now, but record a follow-up issue for stable IDs and diffed updates.

**Implementation details**
- Do not implement this in the same refactor.
- Document the reasons to defer:
  - stable child IDs
  - per-set metadata/history
  - reduced transaction cost on large workouts
  - better compatibility with future concurrent edits

**Acceptance criteria**
- The current refactor does not attempt to solve diff-based persistence.
- The follow-up issue clearly states trigger conditions for revisiting the PATCH strategy.

## Test Cases And Scenarios

### Seed generation
- Create route returns a blank draft with one empty exercise and one empty set.
- Edit route returns the existing workout as-is.
- Duplicate route returns:
  - copied name
  - today’s date
  - empty notes and duration
  - cleared set values in the editable draft
  - original set values only in template hints

### Save behavior
- Create save uses `POST` and receives a `workoutId`.
- Duplicate save uses `POST` and receives a `workoutId`.
- Edit save uses `PATCH`.
- After create/duplicate success:
  - form stays mounted
  - URL changes to `/workouts/edit/:id`
  - mode becomes update
  - dirty state resets
  - another save uses `PATCH`

### Save status
- New create/duplicate form shows “not saved”.
- Dirty edit form shows “unsaved changes”.
- During any save, status shows “saving”.
- After update success, status shows “saved”.
- After failure, status shows “save failed”.
- Editing after a failure clears failed state and returns to unsaved/idle behavior.

### Performance-sensitive scenarios
- Editing one set in a large workout does not rerender the entire exercise list due to a root `useWatch`.
- Duplicate placeholder lookup is O(1) or row-local, not repeated full-array scans per input.
- Exercise selector options load once per form seed path, not once per mount effect without cache.

### Regression scenarios
- Duplicate placeholders still appear correctly in set inputs.
- Exercise history modal still works with current row name.
- Save button disabling and status badge behavior remain correct.
- Refresh after first create/duplicate save opens the canonical edit route successfully.

## Delivery Notes
- Implement Steps 1 through 6 as the core architecture and UX milestone.
- Implement Steps 7 through 11 as the performance and cleanup milestone.
- Implement Step 12 in the same PR as the corresponding architecture changes where possible.
- Keep Step 13 as a separate follow-up GitHub issue, not part of the main refactor.
