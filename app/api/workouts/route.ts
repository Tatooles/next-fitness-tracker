import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { workout } from "@/db/schema";
import { exercise } from "@/db/schema";
import { set } from "@/db/schema";
import { TWorkoutFormSchema, workoutFormSchema } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  // Use zod to validate input
  const result = workoutFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 },
    );
  }

  const { date, name, exercises } = body as TWorkoutFormSchema;
  try {
    const newWorkoutId = await db.transaction(async (tx) => {
      const [newWorkout] = await tx
        .insert(workout)
        .values({
          name,
          date,
          userId,
        })
        .returning();

      for (const exerciseData of exercises) {
        const [newExercise] = await tx
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

        if (setValues.length) {
          await tx.insert(set).values(setValues);
        }
      }
      
      return newWorkout.id;
    });
    
    return NextResponse.json(
      { message: "Workout created", workoutId: newWorkoutId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Transaction failed", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
