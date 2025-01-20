import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import ExercisesUI from "./ExercisesUI";
import { DateExercise, ExerciseSummary, Workout } from "@/lib/types";

async function getExercises() {
  try {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) redirectToSignIn();

    const data = await db.query.workouts.findMany({
      where: (workouts, { eq }) => eq(workouts.userId, userId!),
      orderBy: (workouts, { desc }) => [desc(workouts.date)],
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
  } catch (error) {
    console.log("An error ocurred while fetching workout data");
    return [];
  }
}

async function getExerciseSummary(): Promise<ExerciseSummary[]> {
  const workouts = (await getExercises()) as Workout[];

  const exercises = workouts.flatMap((workout) =>
    workout.exercises.map((exercise) => ({
      ...exercise,
      date: workout.date,
    }))
  ) as DateExercise[];

  const grouped = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.name]) {
      acc[exercise.name] = [];
    }
    acc[exercise.name].push(exercise);
    return acc;
  }, {} as Record<string, DateExercise[]>);

  return Object.entries(grouped).map(([name, exerciseGroup]) => ({
    name,
    exercises: exerciseGroup,
  }));
}

export default async function ExercisesPage() {
  return (
    <ExercisesUI exerciseSummaries={await getExerciseSummary()}></ExercisesUI>
  );
}
