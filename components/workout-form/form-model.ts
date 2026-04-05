import type { ExerciseThin, TWorkoutFormSchema, Workout } from "@/lib/types";

export type PersistMode = "create" | "update";

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

function convertToFormType(workout: Workout): WorkoutDraft {
  return {
    name: `Copy of ${workout.name}`,
    date: new Date().toISOString().substring(0, 10),
    notes: "",
    durationMinutes: null,
    exercises: workout.exercises.map((exercise) => ({
      name: exercise.name,
      notes: "",
      sets: exercise.sets.map((set) => ({
        reps: set.reps,
        weight: set.weight,
        rpe: set.rpe,
      })),
    })),
  };
}

function zeroWorkout(workout: WorkoutDraft): WorkoutDraft {
  const zeroedWorkout = structuredClone(workout);

  zeroedWorkout.exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      set.reps = "";
      set.weight = "";
      set.rpe = "";
    });
  });

  return zeroedWorkout;
}

function toTemplateValuesByExerciseName(
  exercises: ExerciseTemplateValues[],
): Record<string, ExerciseTemplateValues> {
  const templateValuesByExerciseName: Record<string, ExerciseTemplateValues> =
    {};

  for (const exercise of exercises) {
    if (!(exercise.name in templateValuesByExerciseName)) {
      templateValuesByExerciseName[exercise.name] = exercise;
    }
  }

  return templateValuesByExerciseName;
}

export function buildDuplicateWorkoutFormSeed(
  workout: Workout,
): CreateWorkoutFormSeed {
  const workoutTemplate = convertToFormType(workout);

  return {
    persistMode: "create",
    initialValues: zeroWorkout(workoutTemplate),
    templateValuesByExerciseName: toTemplateValuesByExerciseName(
      workoutTemplate.exercises,
    ),
  };
}
