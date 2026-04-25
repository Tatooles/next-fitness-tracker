import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { exercise, set, workout } from "@/db/schema";
import type { ExerciseSummary, Set } from "@/lib/types";

export async function getExerciseSummaryForUser(
  userId: string,
): Promise<ExerciseSummary[]> {
  const rows = await db
    .select({
      exercise: {
        id: exercise.id,
        name: exercise.name,
        notes: exercise.notes,
        workoutId: exercise.workoutId,
      },
      workout: {
        date: workout.date,
        userId: workout.userId,
      },
      set: {
        id: set.id,
        reps: set.reps,
        weight: set.weight,
        rpe: set.rpe,
        exerciseId: set.exerciseId,
      },
    })
    .from(exercise)
    .innerJoin(workout, eq(exercise.workoutId, workout.id))
    .leftJoin(set, eq(set.exerciseId, exercise.id))
    .where(eq(workout.userId, userId));

  const summaries: ExerciseSummary[] = [];

  rows.forEach((row) => {
    const { exercise, workout, set } = row;
    if (!exercise?.name) return;

    let exerciseSummary = summaries.find((g) => g.name === exercise.name);

    if (!exerciseSummary) {
      exerciseSummary = { name: exercise.name, exercises: [] };
      summaries.push(exerciseSummary);
    }

    const exerciseInstance = exerciseSummary.exercises.find(
      (e) => e.id === exercise.id,
    );

    if (!exerciseInstance) {
      exerciseSummary.exercises.push({
        id: exercise.id,
        name: exercise.name,
        notes: exercise.notes,
        workoutId: exercise.workoutId,
        date: workout.date,
        userId: workout.userId,
        sets: set ? [set as Set] : [],
      });
    } else if (set) {
      exerciseInstance.sets.push(set as Set);
    }
  });

  summaries.sort((a, b) => b.exercises.length - a.exercises.length);

  return summaries;
}
