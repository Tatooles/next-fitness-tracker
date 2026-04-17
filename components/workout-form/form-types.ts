import type { ExerciseThin, TWorkoutFormSchema } from "@/lib/types";

export type PersistMode = "create" | "update";
export type WorkoutFormSeedMode = "create" | "edit" | "duplicate";

export type WorkoutDraft = TWorkoutFormSchema;

export type ExerciseTemplateValues = ExerciseThin;
export type ExerciseTemplateValuesByName = Record<
  string,
  ExerciseTemplateValues
>;

export type WorkoutFormSeed = {
  initialValues: WorkoutDraft;
  persistMode: PersistMode;
  exerciseNames: string[];
  workoutId?: number;
  templateValuesByExerciseName?: ExerciseTemplateValuesByName;
};

export type CreateWorkoutFormSeed = Omit<WorkoutFormSeed, "persistMode"> & {
  persistMode: "create";
};

export type SaveState = "idle" | "saving" | "saved" | "failed";

export type CreateWorkoutFormProps = {
  initialValues: WorkoutDraft;
  persistMode: "create";
  exerciseNames: string[];
  templateValuesByExerciseName?: ExerciseTemplateValuesByName;
};

export type UpdateWorkoutFormProps = {
  initialValues: WorkoutDraft;
  persistMode: "update";
  exerciseNames: string[];
  workoutId: number;
  templateValuesByExerciseName?: ExerciseTemplateValuesByName;
};

export type WorkoutFormProps = CreateWorkoutFormProps | UpdateWorkoutFormProps;
