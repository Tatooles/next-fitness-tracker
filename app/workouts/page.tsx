import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { Button } from "@/components/ui/button";
import Workouts from "./Workouts";
import { Workout } from "@/lib/types";

async function getWorkouts() {
  try {
    const userId = auth().userId;
    if (!userId) return [];

    const data: Workout[] = await db.query.workouts.findMany({
      where: (workouts, { eq }) => eq(workouts.userId, userId),
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
      <Button>
        <Link href="/workouts/create">Add Workout</Link>
      </Button>
      <Workouts workouts={workouts}></Workouts>
    </div>
  );
}
