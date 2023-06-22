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
            sets: true,
          },
        },
      },
    });
    return data;
  } else {
    return [];
  }
  // Might have to stringify and parse so we don't get that date error
}

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();
  return <WorkoutUI workouts={workouts}></WorkoutUI>;
}
