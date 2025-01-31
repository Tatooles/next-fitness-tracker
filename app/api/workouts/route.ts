import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { workout } from "@/db/schema";
import { exercise } from "@/db/schema";
import { set } from "@/db/schema";
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
  const workoutData = body as TWorkoutFormSchema;
  try {
    await db.transaction(async () => {
      const workoutResult = await db.insert(workout).values({
        name: workoutData.name,
        date: workoutData.date,
        userId: userId,
      });

      for (const exerciseData of workoutData.exercises) {
        const exerciseResult = await db.insert(exercise).values({
          workoutId: Number(workoutResult.lastInsertRowid),
          name: exerciseData.name,
          notes: exerciseData.notes,
        });

        for (const setData of exerciseData.sets) {
          await db.insert(set).values({
            exerciseId: Number(exerciseResult.lastInsertRowid),
            reps: setData.reps,
            weight: setData.weight,
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
