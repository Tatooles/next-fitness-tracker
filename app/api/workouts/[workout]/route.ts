import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { workout } from "@/db/schema";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ workout: number }> }
) {
  try {
    await db.delete(workout).where(eq(workout.id, (await params).workout));
    return new Response("Workout successfully deleted");
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
  }
}
