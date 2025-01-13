import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { workouts } from "@/db/schema";
import { exercises } from "@/db/schema";
import { sets } from "@/db/schema";
import { TWorkoutFormSchema, workoutFormSchema } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: unknown = await request.json();

  // Use zod to validate input
  const result = workoutFormSchema.safeParse(body);
  let zodErrors = {};
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    return NextResponse.json({ errors: zodErrors });
  }

  const { userId } = await auth();
  const workout = body as TWorkoutFormSchema;
  try {
    await db.transaction(async () => {
      const workoutResult = await db.insert(workouts).values({
        name: workout.name,
        date: workout.date,
        userId: userId,
      });

      for (const exercise of workout.exercises) {
        const exerciseResult = await db.insert(exercises).values({
          workoutId: Number(workoutResult.lastInsertRowid),
          name: exercise.name,
          notes: exercise.notes,
        });

        for (const set of exercise.sets) {
          await db.insert(sets).values({
            exerciseId: Number(exerciseResult.lastInsertRowid),
            reps: set.reps,
            weight: set.weight,
          });
        }
      }
    });
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
    return NextResponse.json({ success: false });
  }
  return NextResponse.json({ success: true });
}
