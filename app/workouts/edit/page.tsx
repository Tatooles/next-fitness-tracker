import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { Workout } from "@/lib/types";

async function getWorkout(id: number) {
  // TODO: We do want to enforce userId so people can't look at other users' workouts
  const data: Workout[] = await db.query.workouts.findMany({
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
  console.log(data[0]);
  console.log(data[0].exercises[0].sets);
  return data;
}

export default async function EditWorkoutPage() {
  const workout = await getWorkout(147);
  // Could run a query on page load to get the workout, but it would be nice to pass it in since we already have it
  return <div>test</div>;
}
