import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import ExercisesUI from "./ExercisesUI";
import { DateExercise, Workout } from "@/lib/types";

async function getExercises() {
  try {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) redirectToSignIn();

    // Prob update this query to use a group by name
    // Query is essentially select exercise where id = userid group by name
    // But then have to figure out how to join on date
    // Maybe date should be in the DB?
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

async function getExerciseSummary() {
  const workouts = (await getExercises()) as Workout[];
  const exercises = workouts.flatMap((workout) =>
    workout.exercises.map((exercise) => ({
      ...exercise,
      date: workout.date,
    }))
  ) as DateExercise[];

  // TODO: Probably possible to clean up this code
  // May need to update DB entry, or possible can query for this directly

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
  getExerciseSummary();
  // TODO: Ideally want to group these exercises by name
  // Then display all excercises with the same name together
  // The sets and notes for each instance of the exercise is displayed under it's date
  // return <ExercisesUI exercises={exercises}></ExercisesUI>;
}
