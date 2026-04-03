import { db } from "@/db/drizzle";
import { exercise, workout } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { jsonError, requireUserId } from "@/lib/api/route-helpers";

export async function GET() {
  const userIdResult = await requireUserId();
  if (!userIdResult.ok) {
    return userIdResult.response;
  }

  const userId = userIdResult.value;

  try {
    const result = await db
      .selectDistinct({ name: exercise.name })
      .from(exercise)
      .innerJoin(workout, eq(exercise.workoutId, workout.id))
      .where(eq(workout.userId, userId));

    return NextResponse.json(result.map((row) => row.name));
  } catch (error) {
    console.error("Error fetching unique exercise names:", error);
    return jsonError("Failed to fetch exercise names", 500);
  }
}
