import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import WorkoutNotFound from "../WorkoutNotFound";
import { Workout, TWorkoutFormSchema } from "@/lib/types";
import WorkoutForm from "@/app/workouts/WorkoutForm";

async function getWorkout(id: number) {
  // TODO: We do want to enforce userId so people can't look at other users' workouts
  const data: Workout | undefined = await db.query.workouts.findFirst({
    where: (workouts, { eq }) => eq(workouts.id, id),
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
    name: `Copy of ${workout.name}`,
    date: new Date().toISOString().substring(0, 10),
    exercises: workout.exercises.map((exercise) => ({
      name: exercise.name,
      notes: "",
      sets: exercise.sets.map((set) => ({
        reps: set.reps,
        weight: "",
      })),
    })),
  };

  return convertedWorkout;
};

export default async function DuplicateWorkoutPage({
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
        editMode={false}
        workoutId={-1}
      ></WorkoutForm>
    );
  }
}
