import { db } from "@/db/drizzle";
import { exerciseView } from "@/db/schema";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  try {
    const result = await db
      .selectDistinct({ name: exerciseView.name })
      .from(exerciseView)
      .where(eq(exerciseView.userId, userId!));

    return NextResponse.json(result.map((row) => row.name));
  } catch (error) {
    console.error("Error fetching unique exercise names:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercise names" },
      { status: 500 },
    );
  }
}
