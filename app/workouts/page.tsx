import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { Button } from "@/components/ui/button";
import { Workout } from "@/lib/types";
import Workouts from "@/components/workouts";
import { Plus } from "lucide-react";

async function getWorkouts() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn();
  }

  try {
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
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return data;
  } catch (error) {
    console.error("Failed to fetch workouts", error);
    return [];
  }
}

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();

  return (
    <div className="mx-auto max-w-2xl p-5 text-center">
      <h1 className="mb-5 text-4xl font-semibold">Workouts</h1>
      <Button asChild className="mb-5 w-full sm:w-36">
        <Link href="/workouts/create">
          <Plus />
          <span>Create Workout</span>
        </Link>
      </Button>
      <Workouts workouts={workouts} />
    </div>
  );
}
