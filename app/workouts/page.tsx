import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import WorkoutUI from "./WorkoutUI";
import { Workout } from "@/lib/types";

async function getWorkouts() {
  const userId = auth().userId;
  if (userId) {
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
  } else {
    return [];
  }
}

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();
  return <WorkoutUI workouts={workouts}></WorkoutUI>;
}
