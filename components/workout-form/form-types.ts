import type { ExerciseThin, TWorkoutFormSchema } from "@/lib/types";

export type PersistMode = "create" | "update";
export type WorkoutFormSeedMode = "create" | "edit" | "duplicate";

export type WorkoutDraft = TWorkoutFormSchema;

export type ExerciseTemplateValues = ExerciseThin;

export type WorkoutFormSeed = {
  initialValues: WorkoutDraft;
  persistMode: PersistMode;
  workoutId?: number;
  templateValuesByExerciseName?: Record<string, ExerciseTemplateValues>;
};

export type CreateWorkoutFormSeed = Omit<WorkoutFormSeed, "persistMode"> & {
  persistMode: "create";
};

export type SaveState = "idle" | "saving" | "saved" | "failed";

export type CreateWorkoutFormProps = {
  initialValues: WorkoutDraft;
  persistMode: "create";
  templateValuesByExerciseName?: Record<string, ExerciseTemplateValues>;
};

export type UpdateWorkoutFormProps = {
  initialValues: WorkoutDraft;
  persistMode: "update";
  workoutId: number;
  templateValuesByExerciseName?: Record<string, ExerciseTemplateValues>;
};

export type WorkoutFormProps =
  | CreateWorkoutFormProps
  | UpdateWorkoutFormProps;
