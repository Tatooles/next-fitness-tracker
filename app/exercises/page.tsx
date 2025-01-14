import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import ExercisesUI from "./ExercisesUI";
import { DateExercise, Workout } from "@/lib/types";

async function getExercises() {
  try {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) redirectToSignIn();

    const data = await db.query.workouts.findMany({
      where: (workouts, { eq }) => eq(workouts.userId, userId!),
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

    data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return data;
  } catch (error) {
    console.log("An error ocurred while fetching workout data");
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
  ) as DateExercise[];
  return <ExercisesUI exercises={exercises}></ExercisesUI>;
}
