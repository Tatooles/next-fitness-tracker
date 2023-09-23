import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import WorkoutNotFound from "../WorkoutNotFound";
import { Workout, TWorkoutFormSchema } from "@/lib/types";
import WorkoutForm from "@/app/workouts/WorkoutForm";

async function getWorkout(id: number) {
  const userId = auth().userId;
  if (!userId) return undefined;
  const data: Workout | undefined = await db.query.workouts.findFirst({
    where: (workouts, { eq, and }) =>
      and(eq(workouts.id, id), eq(workouts.userId, userId)),
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
  if (!workout) return workout;
  const convertedWorkout: TWorkoutFormSchema = {
    name: workout.name,
    date: workout.date.toISOString().substring(0, 10),
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
  searchParams: { id: number };
}) {
  const workoutId = searchParams.id;
  const workout = await getWorkout(workoutId);

  if (!workout) {
    return <WorkoutNotFound></WorkoutNotFound>;
  } else {
    return (
      <WorkoutForm
        workoutValue={workout}
        editMode={true}
        workoutId={workoutId}
      ></WorkoutForm>
    );
  }
}
