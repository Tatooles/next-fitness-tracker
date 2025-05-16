import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { workout } from "@/db/schema";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ workout: number }> }
) {
  try {
    await db.delete(workout).where(eq(workout.id, (await params).workout));
    return new Response("Workout successfully deleted");
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        { error: "Failed to delete workout" },
        { status: 500 }
      );
  }
}
