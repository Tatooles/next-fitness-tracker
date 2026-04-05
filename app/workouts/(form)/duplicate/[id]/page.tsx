import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { Workout } from "@/lib/types";
import { buildDuplicateWorkoutFormSeed } from "@/components/workout-form/form-model";
import WorkoutForm from "@/components/workout-form/workout-form";
import WorkoutNotFound from "@/components/workout-form/workout-not-found";

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
  return data;
}

export default async function DuplicateWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (isNaN(+id)) return <WorkoutNotFound />;

  const workout = await getWorkout(+id);

  if (!workout) {
    return <WorkoutNotFound />;
  }

  const workoutSeed = buildDuplicateWorkoutFormSeed(workout);

  return <WorkoutForm {...workoutSeed} />;
}
