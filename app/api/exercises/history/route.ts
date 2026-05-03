import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { exercise, set, workout } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import type { ExerciseHistoryEntry } from "@/lib/types";
import { jsonError, requireUserId } from "@/lib/api/route-helpers";

export async function GET(request: NextRequest) {
  const userIdResult = await requireUserId();
  if (!userIdResult.ok) {
    return userIdResult.response;
  }

  const userId = userIdResult.value;
  const exerciseName = request.nextUrl.searchParams.get("name");
  const trimmedExerciseName = exerciseName?.trim();

  if (!trimmedExerciseName) {
    return jsonError("Exercise name is required", 400);
  }

  try {
    const rows = await db
      .select({
        workout: {
          date: workout.date,
          name: workout.name,
        },
        exercise: {
          id: exercise.id,
          notes: exercise.notes,
          workoutId: exercise.workoutId,
        },
        set: {
          id: set.id,
          reps: set.reps,
          weight: set.weight,
          rpe: set.rpe,
          exerciseId: set.exerciseId,
        },
      })
      .from(workout)
      .innerJoin(exercise, eq(exercise.workoutId, workout.id))
      .leftJoin(set, eq(set.exerciseId, exercise.id))
      .where(
        and(eq(workout.userId, userId), eq(exercise.name, trimmedExerciseName)),
      )
      .orderBy(desc(workout.date), asc(set.id));

    const historyByExerciseId = new Map<number, ExerciseHistoryEntry>();

    rows.forEach((row) => {
      if (!historyByExerciseId.has(row.exercise.id)) {
        historyByExerciseId.set(row.exercise.id, {
          date: row.workout.date,
          notes: row.exercise.notes,
          workoutId: row.exercise.workoutId,
          workoutName: row.workout.name,
          sets: [],
        });
      }

      if (row.set) {
        const exerciseHistory = historyByExerciseId.get(row.exercise.id);
        if (exerciseHistory) {
          exerciseHistory.sets.push(row.set);
        }
      }
    });

    const history = Array.from(historyByExerciseId.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching exercise history:", error);
    return jsonError("Failed to fetch exercise history", 500);
  }
}
