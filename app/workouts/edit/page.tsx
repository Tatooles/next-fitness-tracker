import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { Workout, Exercise } from "@/lib/types";
import ExerciseItem from "@/components/ExerciseItem";

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
  return data;
}

export default async function EditWorkoutPage({
  searchParams,
}: {
  searchParams: { id: number };
}) {
  const workout = await getWorkout(searchParams.id);

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
      <div className="mx-auto p-4 sm:max-w-md">
        <span>
          {workout?.date.toLocaleDateString()} - {workout?.name}
        </span>
        <div className="flex justify-start pt-2"></div>
        <div className="text-center">
          <div className="divide-y-2 px-2">
            {workout?.exercises.map((exercise: Exercise) => (
              <div className="p-2" key={exercise.id}>
                <h3 className="text-lg font-bold">{exercise.name}</h3>
                <ExerciseItem exercise={exercise}></ExerciseItem>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
