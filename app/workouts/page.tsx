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
    <div className="p-5 text-center max-w-2xl mx-auto">
      <h1 className="text-4xl mb-5 font-semibold">Workouts</h1>
      <Button asChild className="w-full sm:w-36 mb-5">
        <Link href="/workouts/create">Add Workout</Link>
      </Button>
      <Workouts workouts={workouts}></Workouts>
    </div>
  );
}
