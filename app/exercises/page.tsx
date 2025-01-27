import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import ExercisesUI from "./ExercisesUI";
import { ExerciseSummary } from "@/lib/types";
import { exerciseView, sets } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getExercises() {
  try {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) redirectToSignIn();

    // Maybe add type for data so everything can't be null
    const data = await db
      .select()
      .from(exerciseView)
      .fullJoin(sets, eq(sets.exerciseId, exerciseView.id))
      .where(eq(exerciseView.userId, userId!));

    return data;
  } catch (error) {
    console.log("An error ocurred while fetching workout data", error);
    return [];
  }
}

async function getExerciseSummary() {
  const exercises = await getExercises();

  const summaries: ExerciseSummary[] = [];

  exercises.forEach(({ exercise_view, sets }) => {
    let exerciseSummary = summaries.find((g) => g.name === exercise_view?.name);

    if (!exerciseSummary) {
      // Create new exercise summary if it doesn't exist
      exerciseSummary = { name: exercise_view?.name!, exercises: [] };
      summaries.push(exerciseSummary);
    }

    const exerciseInstance = exerciseSummary.exercises.find(
      (e) => e.id === exercise_view?.id
    );

    if (!exerciseInstance) {
      // Create new exercise instance if it doesn't exist
      exerciseSummary.exercises.push({
        ...exercise_view,
        sets: sets ? [sets] : [],
      });
    } else if (sets) {
      // If it does exist, add the set
      exerciseInstance.sets.push(sets);
    }
  });

  return summaries;
}

export default async function ExercisesPage() {
  return (
    <ExercisesUI exerciseSummaries={await getExerciseSummary()}></ExercisesUI>
  );
}
