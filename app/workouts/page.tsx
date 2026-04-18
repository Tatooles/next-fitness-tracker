import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { Button } from "@/components/ui/button";
import { WorkoutSummary } from "@/lib/types";
import Workouts from "@/components/workouts";
import { Plus } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { workout } from "@/db/schema";

async function getWorkouts() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn();
  }

  try {
    const data: WorkoutSummary[] = await db
      .select({
        id: workout.id,
        name: workout.name,
        notes: workout.notes,
        durationMinutes: workout.durationMinutes,
        date: workout.date,
      })
      .from(workout)
      .where(eq(workout.userId, userId!))
      .orderBy(desc(workout.date));

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
