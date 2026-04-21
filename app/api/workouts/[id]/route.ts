import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { exercise, set, workout } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { Workout } from "@/lib/types";
import { workoutFormSchema } from "@/lib/types";
import {
  jsonError,
  parseJsonBody,
  parsePositiveIntParam,
  requireOwnedWorkout,
  requireUserId,
} from "@/lib/api/route-helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userIdResult = await requireUserId();
  if (!userIdResult.ok) {
    return userIdResult.response;
  }

  const { id } = await params;
  const workoutIdResult = parsePositiveIntParam(id, "workout id");
  if (!workoutIdResult.ok) {
    return workoutIdResult.response;
  }

  const ownedWorkout: Workout | undefined = await db.query.workout.findFirst({
    where: (workout, { and, eq }) =>
      and(
        eq(workout.id, workoutIdResult.value),
        eq(workout.userId, userIdResult.value),
      ),
    with: {
      exercises: {
        orderBy: (exercises, { asc }) => [asc(exercises.id)],
        with: {
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.id)],
          },
        },
      },
    },
  });

  if (!ownedWorkout) {
    return jsonError("Workout not found", 404);
  }

  return NextResponse.json(ownedWorkout);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userIdResult = await requireUserId();
    if (!userIdResult.ok) {
      return userIdResult.response;
    }

    const { id } = await params;
    const workoutIdResult = parsePositiveIntParam(id, "workout id");
    if (!workoutIdResult.ok) {
      return workoutIdResult.response;
    }

    const ownershipResult = await requireOwnedWorkout(
      userIdResult.value,
      workoutIdResult.value,
    );
    if (!ownershipResult.ok) {
      return ownershipResult.response;
    }

    await db.delete(workout).where(eq(workout.id, ownershipResult.value.id));
    return new Response("Workout successfully deleted");
  } catch (error) {
    console.error("Delete failed", error);
    return jsonError("Failed to delete workout", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userIdResult = await requireUserId();
  if (!userIdResult.ok) {
    return userIdResult.response;
  }

  const workoutIdResult = parsePositiveIntParam(id, "workout id");
  if (!workoutIdResult.ok) {
    return workoutIdResult.response;
  }

  const ownershipResult = await requireOwnedWorkout(
    userIdResult.value,
    workoutIdResult.value,
  );
  if (!ownershipResult.ok) {
    return ownershipResult.response;
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

  const { name, notes, durationMinutes, date, exercises } = result.data;
  const userId = userIdResult.value;
  const workoutId = ownershipResult.value.id;

  try {
    await db.transaction(async (tx) => {
      // Update workout table
      await tx
        .update(workout)
        .set({ name, notes, durationMinutes, date })
        .where(and(eq(workout.id, workoutId), eq(workout.userId, userId)));

      // Delete old exercises and sets
      const oldExercises = await tx
        .select({ id: exercise.id })
        .from(exercise)
        .where(eq(exercise.workoutId, workoutId));

      const oldExerciseIds = oldExercises.map((ex) => ex.id);

      if (oldExerciseIds.length > 0) {
        await tx.delete(set).where(inArray(set.exerciseId, oldExerciseIds));
        await tx.delete(exercise).where(inArray(exercise.id, oldExerciseIds));
      }

      // Re-insert exercises and sets
      for (const exerciseData of exercises) {
        const [newExercise] = await tx
          .insert(exercise)
          .values({
            workoutId,
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
    });
  } catch (error) {
    console.error("Transaction failed", error);
    return jsonError("Something went wrong", 500);
  }

  return NextResponse.json({ message: "Workout updated" });
}
