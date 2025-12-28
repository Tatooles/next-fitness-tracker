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

/**
 * Populates placeholder values for a template workout
 * @param workout the workout to populate placeholder values with
 * @returns a form poulated with placeholder values
 */
const convertToFormType = (
  workout: Workout | undefined,
): TWorkoutFormSchema | undefined => {
  if (!workout) return undefined;
  const convertedWorkout: TWorkoutFormSchema = {
    name: `Copy of ${workout.name}`,
    date: new Date().toISOString().substring(0, 10),
    exercises: workout.exercises.map((exercise) => ({
      name: exercise.name,
      notes: "",
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
  });

  return zeroedWorkout;
};

export default async function DuplicateWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (isNaN(+id)) return <WorkoutNotFound></WorkoutNotFound>;

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
