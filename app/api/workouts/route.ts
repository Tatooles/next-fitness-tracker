import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { workouts } from "@/db/schema";
import { exercises } from "@/db/schema";
import { sets } from "@/db/schema";
import { Workout } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const workout = body.workout;
  console.log(body);
  try {
    // This will likely end up being a pretty big query. Hopefully we don't have to insert each item indivivually
    // TODO: Likely going to iterate through the nested data and do an insert for each part
    // const result = await db
    //   .insert(workouts)
    //   .values({ name: workout.name, date: workout.date, userId: body.userId });
    await db.transaction(async (tx) => {
      const workoutResult = await db.insert(workouts).values({
        name: workout.name,
        date: workout.date,
        userId: body.userId,
      });
      let workout_id = parseInt(workoutResult.insertId);
      for (const exercise of workout.exercises) {
        let exerciseResult = await db.insert(exercises).values({
          workoutId: workout_id,
          name: exercise.name,
          notes: exercise.notes,
        });
        let exercise_id = parseInt(exerciseResult.insertId);
        // Another nested loop for sets?
        for (const set of exercise.sets) {
          const result = await db.insert(sets).values({
            exerciseId: exercise_id,
            reps: set.reps,
            weight: set.weight,
          });

          console.log(result);
        }
      }
      // await tx.rollback();
    });
    return new Response("Hello from api/workouts");
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
  }
}

export async function GET(request: Request) {
  try {
    const result = await db.select().from(workouts);
    return new Response(JSON.stringify({ workouts: result }));
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
  }
}
