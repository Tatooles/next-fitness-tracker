import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { workouts } from "@/db/schema";
import { exercises } from "@/db/schema";
import { sets } from "@/db/schema";

export async function DELETE(
  request: Request,
  { params }: { params: { workout: number } }
) {
  const workout = params.workout;
  try {
    await db.transaction(async (tx) => {
      const result = await db.query.workouts.findMany({
        where: (workouts, { eq }) => eq(workouts.id, workout),
        columns: {},
        with: {
          exercises: {
            columns: {
              id: true,
            },
            with: {
              sets: {
                columns: {
                  id: true,
                },
              },
            },
          },
        },
      });
      for (const exercise of result[0].exercises) {
        await db.delete(exercises).where(eq(exercises.id, exercise.id));
        for (const set of exercise.sets) {
          await db.delete(sets).where(eq(sets.id, set.id));
        }
      }
      await db.delete(workouts).where(eq(workouts.id, workout));
    });
    return new Response("Workout successfully deleted");
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
  }
}
