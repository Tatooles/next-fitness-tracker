import { db } from "@/db/drizzle";
import { workout } from "@/db/schema";
import { workoutFormSchema } from "@/lib/types";
import { jsonError, parseJsonBody, requireUserId } from "@/lib/api/route-helpers";
import { insertWorkoutExercises } from "@/lib/api/workout-write";
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

      await insertWorkoutExercises(tx, newWorkout.id, exercises);

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
