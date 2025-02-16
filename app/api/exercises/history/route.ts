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

export interface ExerciseGroupedByDate {
  [date: string]: {
    notes: string | null;
    sets: { reps: string; weight: string; rpe: string }[];
  };
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  const exerciseName = request.nextUrl.searchParams.get("name");

  try {
    const exerciseData = await db
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
    const groupByDate = (data: ExerciseData[]): ExerciseGroupedByDate => {
      return data.reduce((acc, { exercise_view, set }) => {
        const { date, notes } = exercise_view!;
        if (!acc[date!]) {
          acc[date!] = { notes, sets: [] };
        }
        acc[date!].sets.push({
          reps: set!.reps,
          weight: set!.weight,
          rpe: set!.rpe,
        });
        return acc;
      }, {} as ExerciseGroupedByDate);
    };

    console.log(groupByDate(exerciseData));

    return NextResponse.json(groupByDate(exerciseData));
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
  }
}
