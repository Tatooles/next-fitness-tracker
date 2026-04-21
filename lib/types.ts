import * as z from "zod";

export interface Workout {
  id: number;
  name: string;
  notes: string;
  durationMinutes: number | null;
  userId: string | null;
  date: string;
  exercises: ExerciseInstance[];
}

export interface WorkoutSummary {
  id: number;
  name: string;
  notes: string;
  durationMinutes: number | null;
  date: string;
}

// Reps and sets are strings because they can be a range
export interface ExerciseInstance {
  id: number;
  name: string;
  notes: string;
  supersetGroupId: string | null;
  workoutId: number;
  sets: Set[];
  // It would make sense for ExerciseInstance to contain date :/
}

export interface ExerciseThin {
  name: string;
  notes: string;
  supersetGroupId: string | null;
  sets: {
    weight: string;
    reps: string;
    rpe: string;
  }[];
}

export interface DateExercise {
  userId?: string | null;
  date?: string | null;
  id?: number | null;
  name?: string | null;
  notes?: string | null;
  supersetGroupId?: string | null;
  workoutId?: number | null;
  workoutName?: string | null;
  sets: Set[];
}

export interface ExerciseSummary {
  name: string;
  exercises: DateExercise[];
}

export interface Set {
  id: number;
  weight: string;
  reps: string;
  rpe: string;
  exerciseId: number;
}

const nullableDurationMinutesSchema = z
  .number({ error: "Workout duration must be a whole number of minutes" })
  .int("Workout duration must be a whole number of minutes")
  .positive("Workout duration must be greater than 0")
  .nullable();

const workoutDateSchema = z
  .string()
  .trim()
  .min(1, "Workout date is required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Workout date must be in YYYY-MM-DD format");

const workoutExerciseSchema = z.object({
  name: z.string().min(1, "Exercise name must be at least 1 character"),
  notes: z.string(),
  supersetGroupId: z.string().trim().min(1).nullable(),
  sets: z
    .object({
      weight: z.string(),
      reps: z.string(),
      rpe: z.string(),
    })
    .array(),
});

function addSupersetValidation(
  exercises: z.infer<typeof workoutExerciseSchema>[],
  context: z.RefinementCtx,
) {
  const groupIndices = new Map<string, number[]>();

  exercises.forEach((exercise, index) => {
    if (!exercise.supersetGroupId) {
      return;
    }

    const indices = groupIndices.get(exercise.supersetGroupId) ?? [];
    indices.push(index);
    groupIndices.set(exercise.supersetGroupId, indices);
  });

  for (const [supersetGroupId, indices] of groupIndices) {
    if (indices.length < 2) {
      context.addIssue({
        code: "custom",
        message: `Superset group "${supersetGroupId}" must include at least 2 exercises`,
        path: ["exercises", indices[0], "supersetGroupId"],
      });
      continue;
    }

    for (let index = 1; index < indices.length; index += 1) {
      if (indices[index] !== indices[index - 1] + 1) {
        context.addIssue({
          code: "custom",
          message: `Superset group "${supersetGroupId}" exercises must stay adjacent`,
          path: ["exercises", indices[index], "supersetGroupId"],
        });
        break;
      }
    }
  }
}

export const workoutFormSchema = z
  .object({
    date: workoutDateSchema,
    name: z
      .string()
      .min(1, "Workout name must be at least 1 character")
      .max(50),
    notes: z.string(),
    durationMinutes: nullableDurationMinutesSchema,
    exercises: workoutExerciseSchema.array(),
  })
  .superRefine(({ exercises }, context) => {
    addSupersetValidation(exercises, context);
  });

export type TWorkoutFormSchema = z.infer<typeof workoutFormSchema>;
