import { db } from "@/db/drizzle";
import { exercise, workout } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  try {
    const result = await db
      .selectDistinct({ name: exercise.name })
      .from(exercise)
      .innerJoin(workout, eq(exercise.workoutId, workout.id))
      .where(eq(workout.userId, userId!));

    return NextResponse.json(result.map((row) => row.name));
  } catch (error) {
    console.error("Error fetching unique exercise names:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise names" },
      { status: 500 },
    );
  }
}
