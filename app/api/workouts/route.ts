import { db } from "@/db/drizzle";
import { workout } from "@/db/schema";
import { exercise } from "@/db/schema";
import { set } from "@/db/schema";
import { workoutFormSchema } from "@/lib/types";
import { jsonError, parseJsonBody, requireUserId } from "@/lib/api/route-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const userIdResult = await requireUserId();
  if (!userIdResult.ok) {
    return userIdResult.response;
  }

  const bodyResult = await parseJsonBody(request);
  if (!bodyResult.ok) {
    return bodyResult.response;
  }

  const result = workoutFormSchema.safeParse(bodyResult.value);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 },
    );
  }

  const { date, name, notes, durationMinutes, exercises } = result.data;
  const userId = userIdResult.value;

  try {
    const newWorkoutId = await db.transaction(async (tx) => {
      const [newWorkout] = await tx
        .insert(workout)
        .values({
          name,
          notes,
          durationMinutes,
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
            supersetGroupId: exerciseData.supersetGroupId,
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
    return jsonError("Something went wrong", 500);
  }
}
