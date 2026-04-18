import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { exercise, set, workout } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { Set } from "@/lib/types";
import { jsonError, requireUserId } from "@/lib/api/route-helpers";

export interface GroupedExercise {
  date: string;
  notes: string | null;
  workoutId: number | null;
  workoutName: string | null;
  sets: Set[];
}

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
        workout,
        exercise,
        set,
      })
      .from(workout)
      .innerJoin(exercise, eq(exercise.workoutId, workout.id))
      .leftJoin(set, eq(set.exerciseId, exercise.id))
      .where(
        and(eq(workout.userId, userId), eq(exercise.name, trimmedExerciseName)),
      )
      .orderBy(desc(workout.date), asc(set.id));

    const historyByExerciseId = new Map<number, GroupedExercise>();

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
        historyByExerciseId.get(row.exercise.id)!.sets.push(row.set as Set);
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
