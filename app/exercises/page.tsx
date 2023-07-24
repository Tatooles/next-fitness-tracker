import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import ExercisesUI from "./ExercisesUI";
import { Exercise, Workout } from "@/lib/types";

async function getExercises() {
  const userId = auth().userId;
  if (userId) {
    const data = await db.query.workouts.findMany({
      where: (workouts, { eq }) => eq(workouts.userId, userId),
      columns: {
        date: true,
      },
      with: {
        exercises: {
          with: {
            sets: {
              orderBy: (sets, { asc }) => [asc(sets.id)],
            },
          },
        },
      },
    });
    return data;
  } else {
    return [];
  }
}

export default async function ExercisesPage() {
  const workouts = (await getExercises()) as Workout[];
  const exercises = workouts.flatMap((workout) =>
    workout.exercises.map((exercise) => ({
      ...exercise,
      date: workout.date,
    }))
  );
  exercises.sort((a, b) => b.date.getTime() - a.date.getTime());
  return <ExercisesUI exercises={exercises}></ExercisesUI>;
}
