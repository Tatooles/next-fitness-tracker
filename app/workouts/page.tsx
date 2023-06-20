import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import WorkoutUI from "./WorkoutUI";
async function getWorkouts() {
  const userId = auth().userId as string;
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
  // Might have to stringify and parse so we don't get that date error
  return data;
}

export default async function WorkoutsPage() {
  const workouts = await getWorkouts();
  console.log(auth().userId?.length);
  return <WorkoutUI workouts={workouts}></WorkoutUI>;
}
