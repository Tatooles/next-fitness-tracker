import type {
  DeepKeys,
  DeepKeysOfType,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
  ReactFormExtendedApi,
} from "@tanstack/react-form";

import type { WorkoutDraft } from "@/components/workout-form/form-types";
import type { workoutFormSchema } from "@/lib/types";

export type WorkoutFieldName = DeepKeys<WorkoutDraft>;
export type WorkoutSetDraft = WorkoutDraft["exercises"][number]["sets"][number];
export type WorkoutSetsFieldName = DeepKeysOfType<
  WorkoutDraft,
  WorkoutSetDraft[]
>;

type WorkoutValidator = FormValidateOrFn<WorkoutDraft> | undefined;
type WorkoutAsyncValidator = FormAsyncValidateOrFn<WorkoutDraft> | undefined;

export type WorkoutTanStackForm = ReactFormExtendedApi<
  WorkoutDraft,
  WorkoutValidator,
  WorkoutValidator,
  WorkoutAsyncValidator,
  WorkoutValidator,
  WorkoutAsyncValidator,
  typeof workoutFormSchema,
  WorkoutAsyncValidator,
  WorkoutValidator,
  WorkoutAsyncValidator,
  WorkoutAsyncValidator,
  unknown
>;

export function getFieldErrors(field: {
  state: {
    meta: {
      isValid: boolean;
      errors: Array<{ message?: string } | undefined>;
    };
  };
}) {
  return field.state.meta.isValid ? undefined : field.state.meta.errors;
}
