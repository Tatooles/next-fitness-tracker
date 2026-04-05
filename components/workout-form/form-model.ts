import type { ExerciseThin, TWorkoutFormSchema } from "@/lib/types";

export type PersistMode = "create" | "update";

export type WorkoutDraft = TWorkoutFormSchema;

export type ExerciseTemplateValues = ExerciseThin;

export type WorkoutFormSeed = {
  initialValues: WorkoutDraft;
  persistMode: PersistMode;
  workoutId?: number;
  templateValuesByExerciseName?: Record<string, ExerciseTemplateValues>;
};

export type SaveState = "idle" | "saving" | "saved" | "failed";

export function toTemplateValuesByExerciseName(
  exercises: ExerciseTemplateValues[],
): Record<string, ExerciseTemplateValues> {
  const templateValuesByExerciseName: Record<string, ExerciseTemplateValues> =
    {};

  // TODO: Check if some of the logic from the duplicate page can be moved in here

  for (const exercise of exercises) {
    if (!(exercise.name in templateValuesByExerciseName)) {
      templateValuesByExerciseName[exercise.name] = exercise;
    }
  }

  return templateValuesByExerciseName;
}
