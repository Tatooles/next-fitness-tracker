import "server-only";

import type { db } from "@/db/drizzle";
import { exercise, set } from "@/db/schema";
import type { TWorkoutFormSchema } from "@/lib/types";

type WorkoutTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function insertWorkoutExercises(
  tx: WorkoutTransaction,
  workoutId: number,
  exercises: TWorkoutFormSchema["exercises"],
) {
  for (const exerciseData of exercises) {
    const [newExercise] = await tx
      .insert(exercise)
      .values({
        workoutId,
        name: exerciseData.name,
        notes: exerciseData.notes,
        supersetGroupId: exerciseData.supersetGroupId,
      })
      .returning();

    const setValues = exerciseData.sets.map((setData) => ({
      ...setData,
      exerciseId: newExercise.id,
    }));

    if (setValues.length) {
      await tx.insert(set).values(setValues);
    }
  }
}
