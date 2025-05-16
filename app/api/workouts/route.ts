import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { workout } from "@/db/schema";
import { exercise } from "@/db/schema";
import { set } from "@/db/schema";
import { TWorkoutFormSchema, workoutFormSchema } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  // Use zod to validate input
  const result = workoutFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  const { date, name, exercises } = body as TWorkoutFormSchema;
  try {
    await db.transaction(async () => {
      const [newWorkout] = await db
        .insert(workout)
        .values({
          name,
          date,
          userId,
        })
        .returning();

      for (const exerciseData of exercises) {
        const [newExercise] = await db
          .insert(exercise)
          .values({
            workoutId: newWorkout.id,
            name: exerciseData.name,
            notes: exerciseData.notes,
          })
          .returning();

        const setValues = exerciseData.sets.map((set) => ({
          ...set,
          exerciseId: newExercise.id,
        }));

        await db.insert(set).values(setValues);
      }
    });
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
    return NextResponse.json({ success: false });
  }
  return NextResponse.json({ success: true });
}
