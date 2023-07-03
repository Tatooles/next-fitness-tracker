import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { sql } from "drizzle-orm";
import { Exercise } from "@/lib/types";
import { exercises, workouts } from "@/db/schema";

async function getExercises() {
  const userId = auth().userId;
  if (userId) {
    //   const data: Exercise[] = await db.query.exercises.findMany();
    //   return data;
    const data = await db.execute(sql`select ${exercises}.*, ${workouts.date} 
    from ${exercises} 
    join ${workouts} on ${exercises.workoutId} = ${workouts.id}
    where ${workouts.userId} = ${userId}`);
    return data;
  } else {
    return [];
  }
}

export default async function ExercisesPage() {
  const exercises = await getExercises();
  console.log(exercises);
  return (
    <div>
      {/* {exercises.map((exercise) => (
        <div>{exercise.name}</div>
      ))} */}
    </div>
  );
}
