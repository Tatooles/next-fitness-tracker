import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { workouts } from "@/db/schema";
import { exercises } from "@/db/schema";
import { sets } from "@/db/schema";

export async function POST(request: Request) {
  const body = await request.json();
  const workout = body.workout;
  const id = auth().userId;
  try {
    await db.transaction(async (tx) => {
      let date = workout.date;
      if (!date) {
        date = new Date();
      }
      const workoutResult = await db.insert(workouts).values({
        name: workout.name,
        date: date,
        userId: id,
      });
      let workout_id = parseInt(workoutResult.insertId);
      // TODO: Is there a cleaner way aside from these loops?
      for (const exercise of workout.exercises) {
        let exerciseResult = await db.insert(exercises).values({
          workoutId: workout_id,
          name: exercise.name,
          notes: exercise.notes,
          userId: id,
        });
        let exercise_id = parseInt(exerciseResult.insertId);
        for (const set of exercise.sets) {
          const result = await db.insert(sets).values({
            exerciseId: exercise_id,
            reps: set.reps,
            weight: set.weight,
          });
        }
      }
    });
    return new Response("Hello from api/workouts");
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
  }
}
