import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { Workout, TWorkoutFormSchema } from "@/lib/types";
import WorkoutForm from "@/components/WorkoutForm";

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
    return (
      <div className="mx-auto flex flex-col p-4 text-center sm:max-w-md">
        <p className="text-left">
          Workout not found, please return to the Workouts page
        </p>
        <Link
          className="mx-auto mt-2 rounded-md bg-slate-500 p-2 text-white hover:bg-slate-500/70"
          href="/workouts"
        >
          Workouts
        </Link>
      </div>
    );
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
