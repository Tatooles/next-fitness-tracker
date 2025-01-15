import * as z from "zod";

export interface Workout {
  id: number;
  name: string;
  userId: string | null;
  date: string;
  exercises: ExerciseInstance[];
}

// Reps and sets are strings because they can be a range
export interface ExerciseInstance {
  id: number;
  name: string;
  notes: string;
  workoutId: number;
  sets: Set[];
}

export interface DateExercise extends ExerciseInstance {
  date: string;
}

export interface ExerciseSummary {
  exercises: DateExercise[];
}

export interface Set {
  id: number;
  reps: string;
  weight: string;
  exerciseId: number;
}

export const workoutFormSchema = z.object({
  date: z.string(),
  name: z
    .string()
    .min(1, {
      message: "Workout name must be at least 1 character",
    })
    .max(50),
  exercises: z
    .object({
      name: z.string(),
      notes: z.string(),
      sets: z
        .object({
          reps: z.string(),
          weight: z.string(),
        })
        .array(),
    })
    .array(),
});

export type TWorkoutFormSchema = z.infer<typeof workoutFormSchema>;
