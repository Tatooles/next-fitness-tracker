import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { Exercise } from "@/lib/types";

async function getExercises() {
  const userId = auth().userId;
  // if (userId) {
  //   const data: Exercise[] = await db.query.exercises.findMany();
  //   return data;
  // } else {
  return ["exercise 1", "exercise 2"];
  // }
}

export default async function ExercisesPage() {
  const exercises = await getExercises();
  return <div>{exercises}</div>;
}
