import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { Workout, TWorkoutFormSchema } from "@/lib/types";
import WorkoutForm from "@/app/workouts/(form)/workout-form";
import WorkoutNotFound from "@/app/workouts/(form)/workout-not-found";

async function getWorkout(id: number) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) redirectToSignIn();

  const data: Workout | undefined = await db.query.workout.findFirst({
    where: (workout, { eq, and }) =>
      and(eq(workout.id, id), eq(workout.userId, userId!)),
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
        rpe: set.rpe,
      })),
    })),
  };

  return convertedWorkout;
};

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  if (typeof id !== "string" || isNaN(+id))
    return <WorkoutNotFound></WorkoutNotFound>;

  const workout = await getWorkout(+id);

  if (!workout) {
    return <WorkoutNotFound></WorkoutNotFound>;
  }

  return (
    <WorkoutForm
      workoutValue={workout}
      editMode={true}
      workoutId={+id}
    ></WorkoutForm>
  );
}
