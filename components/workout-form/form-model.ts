import "server-only";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import type { Workout } from "@/lib/types";
import { exercise, workout as workoutTable } from "@/db/schema";
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
      supersetGroupId: exercise.supersetGroupId,
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
      supersetGroupId: exercise.supersetGroupId,
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
  const templateValuesByExerciseName = {} as ExerciseTemplateValuesByName;

  for (const exercise of exercises) {
    if (!Object.hasOwn(templateValuesByExerciseName, exercise.name)) {
      Object.defineProperty(templateValuesByExerciseName, exercise.name, {
        value: exercise,
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
  }

  return templateValuesByExerciseName;
}

async function getSignedInUserId(): Promise<string> {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn();
  }

  return userId!;
}

async function getExerciseNames(userId: string): Promise<string[]> {
  const exerciseNames = await db
    .selectDistinct({ name: exercise.name })
    .from(workoutTable)
    .innerJoin(exercise, eq(exercise.workoutId, workoutTable.id))
    .where(eq(workoutTable.userId, userId));

  return exerciseNames
    .map((row) => row.name)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

async function getOwnedWorkout(
  userId: string,
  workoutId: number,
): Promise<Workout | null> {
  const ownedWorkout = await db.query.workout.findFirst({
    where: (workout, { eq, and }) =>
      and(eq(workout.id, workoutId), eq(workout.userId, userId)),
    with: {
      exercises: {
        orderBy: (exercises, { asc }) => [asc(exercises.id)],
        with: {
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.id)],
          },
        },
      },
    },
  });

  return ownedWorkout ?? null;
}

export function buildBlankWorkoutFormSeed(
  exerciseNames: string[] = [],
): CreateWorkoutFormSeed {
  return {
    persistMode: "create",
    exerciseNames,
    initialValues: {
      name: "",
      date: "",
      notes: "",
      durationMinutes: null,
      exercises: [
        {
          name: "",
          notes: "",
          supersetGroupId: null,
          sets: [{ weight: "", reps: "", rpe: "" }],
        },
      ],
    },
  };
}

export function buildEditWorkoutFormSeed(
  workout: Workout,
  exerciseNames: string[] = [],
): UpdateWorkoutFormProps {
  return {
    persistMode: "update",
    workoutId: workout.id,
    exerciseNames,
    initialValues: toWorkoutDraft(workout),
  };
}

export function buildDuplicateWorkoutFormSeed(
  workout: Workout,
  exerciseNames: string[] = [],
): CreateWorkoutFormSeed {
  const workoutTemplate = toDuplicateWorkoutDraft(workout);

  return {
    persistMode: "create",
    exerciseNames,
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
  const userId = await getSignedInUserId();

  if (kind === "create") {
    return buildBlankWorkoutFormSeed(await getExerciseNames(userId));
  }

  if (workoutId == null) {
    throw new Error(`buildWorkoutFormSeed requires workoutId for ${kind}`);
  }

  const [workout, exerciseNames] = await Promise.all([
    getOwnedWorkout(userId, workoutId),
    getExerciseNames(userId),
  ]);

  if (!workout) {
    return null;
  }

  if (kind === "edit") {
    return buildEditWorkoutFormSeed(workout, exerciseNames);
  }

  return buildDuplicateWorkoutFormSeed(workout, exerciseNames);
}
