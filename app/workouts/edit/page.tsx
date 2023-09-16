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
  // TODO: Show a not found error page if the workout is not found
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
