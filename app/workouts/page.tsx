import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { Button } from "@/components/ui/button";
import { Workout } from "@/lib/types";
import Workouts from "./workouts";

async function getWorkouts() {
  try {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) redirectToSignIn();

    const data: Workout[] = await db.query.workout.findMany({
      where: (workout, { eq }) => eq(workout.userId, userId!),
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

    data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return data;
  } catch (error) {
    console.log("An error ocurred while fetching workout data");
    return [];
  }
}

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Workouts</h1>
      <Button asChild>
        <Link href="/workouts/create">Add Workout</Link>
      </Button>
      <Workouts workouts={workouts}></Workouts>
    </div>
  );
}
