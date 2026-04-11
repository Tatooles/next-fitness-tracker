import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import type { Workout } from "@/lib/types";
import type {
  CreateWorkoutFormSeed,
  ExerciseTemplateValues,
  ExerciseTemplateValuesByName,
  UpdateWorkoutFormProps,
  WorkoutDraft,
  WorkoutFormSeed,
  WorkoutFormSeedMode,
} from "@/components/workout-form/form-types";

function cloneWorkoutDraft(values: WorkoutDraft): WorkoutDraft {
  return structuredClone(values);
}

function toWorkoutDraft(workout: Workout): WorkoutDraft {
  return {
    name: workout.name,
    date: workout.date,
    notes: workout.notes,
    durationMinutes: workout.durationMinutes,
    exercises: workout.exercises.map((exercise) => ({
      name: exercise.name,
      notes: exercise.notes,
      sets: exercise.sets.map((set) => ({
        reps: set.reps,
        weight: set.weight,
        rpe: set.rpe,
      })),
    })),
  };
}

function toDuplicateWorkoutDraft(workout: Workout): WorkoutDraft {
  return {
    name: `Copy of ${workout.name}`,
    date: "",
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

function zeroWorkoutSetValues(workout: WorkoutDraft): WorkoutDraft {
  const zeroedWorkout = cloneWorkoutDraft(workout);

  zeroedWorkout.exercises.forEach((exercise) => {
    exercise.notes = "";
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
): ExerciseTemplateValuesByName {
  const templateValuesByExerciseName = Object.create(
    null,
  ) as ExerciseTemplateValuesByName;

  for (const exercise of exercises) {
    if (!Object.hasOwn(templateValuesByExerciseName, exercise.name)) {
      templateValuesByExerciseName[exercise.name] = exercise;
    }
  }

  return templateValuesByExerciseName;
}

async function getOwnedWorkout(workoutId: number): Promise<Workout | null> {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn();
  }

  const workout = await db.query.workout.findFirst({
    where: (workout, { eq, and }) =>
      and(eq(workout.id, workoutId), eq(workout.userId, userId!)),
    with: {
      exercises: {
        with: {
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.id)],
          },
        },
      },
    },
  });

  return workout ?? null;
}

export function buildBlankWorkoutFormSeed(): CreateWorkoutFormSeed {
  return {
    persistMode: "create",
    initialValues: {
      name: "",
      date: "",
      notes: "",
      durationMinutes: null,
      exercises: [
        {
          name: "",
          notes: "",
          sets: [{ weight: "", reps: "", rpe: "" }],
        },
      ],
    },
  };
}

export function buildEditWorkoutFormSeed(
  workout: Workout,
): UpdateWorkoutFormProps {
  return {
    persistMode: "update",
    workoutId: workout.id,
    initialValues: toWorkoutDraft(workout),
  };
}

export function buildDuplicateWorkoutFormSeed(
  workout: Workout,
): CreateWorkoutFormSeed {
  const workoutTemplate = toDuplicateWorkoutDraft(workout);

  return {
    persistMode: "create",
    initialValues: zeroWorkoutSetValues(workoutTemplate),
    templateValuesByExerciseName: toTemplateValuesByExerciseName(
      workoutTemplate.exercises,
    ),
  };
}

export function buildWorkoutFormSeed(input: {
  kind: "create";
  workoutId?: number;
}): Promise<CreateWorkoutFormSeed>;
export function buildWorkoutFormSeed(input: {
  kind: "edit";
  workoutId: number;
}): Promise<UpdateWorkoutFormProps | null>;
export function buildWorkoutFormSeed(input: {
  kind: "duplicate";
  workoutId: number;
}): Promise<CreateWorkoutFormSeed | null>;
export async function buildWorkoutFormSeed({
  kind,
  workoutId,
}: {
  kind: WorkoutFormSeedMode;
  workoutId?: number;
}): Promise<WorkoutFormSeed | null> {
  if (kind === "create") {
    return buildBlankWorkoutFormSeed();
  }

  if (workoutId == null) {
    throw new Error(`buildWorkoutFormSeed requires workoutId for ${kind}`);
  }

  const workout = await getOwnedWorkout(workoutId);

  if (!workout) {
    return null;
  }

  if (kind === "edit") {
    return buildEditWorkoutFormSeed(workout);
  }

  return buildDuplicateWorkoutFormSeed(workout);
}
