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
    name: `Copy of ${workout.name}`,
    date: new Date().toISOString().substring(0, 10),
    exercises: workout.exercises.map((exercise) => ({
      name: exercise.name,
      notes: "",
      // Would rather this somehow prefill the placeholder, rather than the actual field
      // But where do I store that?
      // Would need an optional prop into WorkoutForm

      // Somehow we need an emptied out template to structure the form
      // And and the real values for the placeholders
      sets: exercise.sets.map((set) => ({
        reps: set.reps,
        weight: set.weight,
        rpe: set.rpe,
      })),
    })),
  };

  return convertedWorkout;
};

const zeroWorkout = (workout?: TWorkoutFormSchema) => {
  if (!workout) return undefined;

  const zeroedWorkout: TWorkoutFormSchema = JSON.parse(JSON.stringify(workout));

  zeroedWorkout.exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      set.reps = "";
      set.weight = "";
      set.rpe = "";
    });

    // Clear notes??
  });

  return zeroedWorkout;
};

export default async function DuplicateWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await searchParams;

  if (typeof id !== "string" || isNaN(+id))
    return <WorkoutNotFound></WorkoutNotFound>;

  const workoutTemplate = await getWorkout(+id);

  const workout = zeroWorkout(workoutTemplate);

  if (!workoutTemplate || !workout) {
    return <WorkoutNotFound></WorkoutNotFound>;
  }

  return (
    <WorkoutForm
      workoutValue={workout}
      editMode={false}
      workoutId={-1}
      placeholderValues={workoutTemplate.exercises}
    ></WorkoutForm>
  );
}
