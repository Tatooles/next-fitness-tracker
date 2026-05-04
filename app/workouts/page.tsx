import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { Button } from "@/components/ui/button";
import type { WorkoutSummary } from "@/lib/types";
import Workouts from "@/components/workouts";
import { Plus } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { workout } from "@/db/schema";

async function getWorkouts() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const data: WorkoutSummary[] = await db
    .select({
      id: workout.id,
      name: workout.name,
      notes: workout.notes,
      durationMinutes: workout.durationMinutes,
      date: workout.date,
    })
    .from(workout)
    .where(eq(workout.userId, userId))
    .orderBy(desc(workout.date));

  return data;
}

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-5 py-6 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Training
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Workouts</h1>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/workouts/create">
            <Plus />
            <span>Create Workout</span>
          </Link>
        </Button>
      </div>
      <Workouts workouts={workouts} />
    </div>
  );
}
