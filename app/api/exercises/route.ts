import { db } from "@/db/drizzle";
import { exercise } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db
      .selectDistinct({ name: exercise.name })
      .from(exercise);

    return NextResponse.json(result.map((row) => row.name));
  } catch (error) {
    console.error("Error fetching unique exercise names:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise names" },
      { status: 500 }
    );
  }
}
