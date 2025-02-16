import { and, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { exerciseView, set, workout } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Set } from "@/lib/types";

export interface ExerciseData {
  set: Set | null;
  exercise_view: {
    userId: string | null;
    name: string | null;
    date: string | null;
    id: number | null;
    notes: string | null;
    workoutId: number | null;
  } | null;
}

export interface GroupedExercise {
  date: string;
  notes: string | null;
  sets: Set[];
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  const exerciseName = request.nextUrl.searchParams.get("name");

  try {
    const data = await db
      .select()
      .from(exerciseView)
      .fullJoin(set, eq(set.exerciseId, exerciseView.id))
      .where(
        and(
          eq(exerciseView.userId, userId!),
          eq(exerciseView.name, exerciseName!)
        )
      );

    // Group exercise data by date into an object that is friendly to the front end
    const grouped: Record<string, GroupedExercise> = {};

    data.forEach((exerciseData) => {
      const { date, notes } = exerciseData.exercise_view! || {};

      // Skip if missing date or set
      if (!date || !exerciseData.set) return;

      if (!grouped[date]) {
        grouped[date] = {
          date,
          notes,
          sets: [],
        };
      }

      // Add set to the respective date
      grouped[date].sets.push(exerciseData.set);
    });

    // Convert back to array and return
    return NextResponse.json(Object.values(grouped));
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
  }
}
