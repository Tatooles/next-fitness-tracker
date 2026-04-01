import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { exercise, set, workout } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Set } from "@/lib/types";

export interface GroupedExercise {
  date: string;
  notes: string | null;
  workoutId: number | null;
  workoutName: string | null;
  sets: Set[];
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  const exerciseName = request.nextUrl.searchParams.get("name");
  const trimmedExerciseName = exerciseName?.trim();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!trimmedExerciseName) {
    return NextResponse.json(
      { error: "Exercise name is required" },
      { status: 400 },
    );
  }

  try {
    const rows = await db
      .select({
        exercise,
        workout,
        set,
      })
      .from(exercise)
      .innerJoin(workout, eq(exercise.workoutId, workout.id))
      .leftJoin(set, eq(set.exerciseId, exercise.id))
      .where(
        and(
          eq(workout.userId, userId),
          eq(exercise.name, trimmedExerciseName),
        ),
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
    return NextResponse.json(
      { error: "Failed to fetch exercise history" },
      { status: 500 },
    );
  }
}
