import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { workouts } from "@/db/schema";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  try {
    await db.delete(workouts).where(eq(workouts.id, (await params).id));
    return new Response("Workout successfully deleted");
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
  }
}
