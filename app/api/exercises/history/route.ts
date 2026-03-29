import { db } from "@/db/drizzle";
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

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!exerciseName?.trim()) {
    return NextResponse.json(
      { error: "Exercise name is required" },
      { status: 400 },
    );
  }

  try {
    const workouts = await db.query.workout.findMany({
      where: (workout, { eq }) => eq(workout.userId, userId),
      with: {
        exercises: {
          where: (exercise, { eq }) => eq(exercise.name, exerciseName.trim()),
          with: {
            sets: {
              orderBy: (sets, { asc }) => [asc(sets.id)],
            },
          },
        },
      },
    });

    const history = workouts.flatMap(({ date, name, exercises }) =>
      exercises.map(
        (exercise): GroupedExercise => ({
          date,
          notes: exercise.notes,
          workoutId: exercise.workoutId,
          workoutName: name,
          sets: exercise.sets as Set[],
        }),
      ),
    );

    const sorted = history.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return NextResponse.json(sorted);
  } catch (error) {
    console.error("Error fetching exercise history:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise history" },
      { status: 500 },
    );
  }
}
