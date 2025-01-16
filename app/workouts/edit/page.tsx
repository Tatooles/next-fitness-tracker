import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import WorkoutNotFound from "../WorkoutNotFound";
import { Workout, TWorkoutFormSchema } from "@/lib/types";
import WorkoutForm from "@/app/workouts/WorkoutForm";

async function getWorkout(id: number) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) redirectToSignIn();

  const data: Workout | undefined = await db.query.workouts.findFirst({
    where: (workouts, { eq, and }) =>
      and(eq(workouts.id, id), eq(workouts.userId, userId!)),
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
  return convertToFormType(data);
}

const convertToFormType = (
  workout: Workout | undefined
): TWorkoutFormSchema | undefined => {
  if (!workout) return undefined;
  const convertedWorkout: TWorkoutFormSchema = {
    name: workout.name,
    date: workout.date,
    exercises: workout.exercises.map((exercise) => ({
      name: exercise.name,
      notes: exercise.notes,
      sets: exercise.sets.map((set) => ({
        reps: set.reps,
        weight: set.weight,
      })),
    })),
  };

  return convertedWorkout;
};

export default async function EditWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await searchParams;
  if (typeof id !== "string" || isNaN(parseInt(id))) return;

  const workout = await getWorkout(+id);

  if (!workout) {
    return <WorkoutNotFound></WorkoutNotFound>;
  } else {
    return (
      <WorkoutForm
        workoutValue={workout}
        editMode={true}
        workoutId={+id}
      ></WorkoutForm>
    );
  }
}
