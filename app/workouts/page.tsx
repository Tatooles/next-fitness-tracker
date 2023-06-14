import { auth } from "@clerk/nextjs/app-beta";
import { db } from "@/db/drizzle";
import WorkoutUI from "./WorkoutUI";
async function getWorkouts() {
  const a = auth();
  const userId = a.userId as string;
  console.log(userId);
  const data = await db.query.workouts.findMany({
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
}

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();
  return <WorkoutUI workouts={workouts}></WorkoutUI>;
}
