import { and, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { exercise, workout, set } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Set } from "@/lib/types";

export interface GroupedExercise {
  date: string;
  notes: string | null;
  workoutId: number | null;
  sets: Set[];
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  const exerciseName = request.nextUrl.searchParams.get("name");

  try {
    const data = await db
      .select()
      .from(exercise)
      .innerJoin(workout, eq(exercise.workoutId, workout.id))
      .leftJoin(set, eq(set.exerciseId, exercise.id))
      .where(
        and(eq(workout.userId, userId!), eq(exercise.name, exerciseName!)),
      );

    // Group exercise data by date into an object that is friendly to the front end
    const grouped: Record<string, GroupedExercise> = {};

    data.forEach((row) => {
      const { date } = row.workout;
      const { notes, workoutId } = row.exercise;

      // Skip if missing date or set
      if (!date || !row.set) return;

      if (!grouped[date]) {
        grouped[date] = {
          date,
          notes,
          workoutId,
          sets: [],
        };
      }

      // Add set to the respective date
      grouped[date].sets.push(row.set);

      // Sort sets by id asc
      grouped[date].sets.sort((a, b) => a.id - b.id);
    });

    // Convert back to array and sort
    const sorted = Object.values(grouped).sort(
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
