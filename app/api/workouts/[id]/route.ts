import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { exercise, set, workout } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { workoutFormSchema } from "@/lib/types";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    await db.delete(workout).where(eq(workout.id, (await params).id));
    return new Response("Workout successfully deleted");
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        { error: "Failed to delete workout" },
        { status: 500 }
      );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const workoutId = (await params).id;
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = workoutFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  const { name, date, exercises } = result.data;

  // Update workout table
  await db
    .update(workout)
    .set({ name, date })
    .where(and(eq(workout.id, workoutId), eq(workout.userId, userId)));

  // Delete old exercises and sets
  const oldExercises = await db
    .select({ id: exercise.id })
    .from(exercise)
    .where(eq(exercise.workoutId, workoutId));

  const oldExerciseIds = oldExercises.map((ex) => ex.id);

  if (oldExerciseIds.length > 0) {
    await db.delete(set).where(inArray(set.exerciseId, oldExerciseIds));
    await db.delete(exercise).where(inArray(exercise.id, oldExerciseIds));
  }

  // Re-insert exercises and sets
  for (const exerciseData of exercises) {
    const [newExercise] = await db
      .insert(exercise)
      .values({
        workoutId,
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

  return NextResponse.json({ message: "Workout updated" });
}
