import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import ExercisesUI from "./exercises-ui";
import { ExerciseSummary } from "@/lib/types";
import { exerciseView, set } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getExercises() {
  try {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) redirectToSignIn();

    const exerciseData = await db
      .select()
      .from(exerciseView)
      .fullJoin(set, eq(set.exerciseId, exerciseView.id))
      .where(eq(exerciseView.userId, userId!));

    return exerciseData;
  } catch (error) {
    console.log("An error occurred while fetching workout data:", error);
    return [];
  }
}

async function getExerciseSummary() {
  const exercises = await getExercises();

  const summaries: ExerciseSummary[] = [];

  // Might be able to use object.group
  exercises.forEach(({ exercise_view, set }) => {
    if (!exercise_view?.name) return;

    let exerciseSummary = summaries.find((g) => g.name === exercise_view.name);

    if (!exerciseSummary) {
      // Create new exercise summary if it doesn't exist
      exerciseSummary = { name: exercise_view.name, exercises: [] };
      summaries.push(exerciseSummary);
    }

    const exerciseInstance = exerciseSummary.exercises.find(
      (e) => e.id === exercise_view?.id,
    );

    if (!exerciseInstance) {
      // Create new exercise instance if it doesn't exist
      exerciseSummary.exercises.push({
        ...exercise_view,
        sets: set ? [set] : [],
      });
    } else if (set) {
      // If it does exist, add the set
      exerciseInstance.sets.push(set);
    }
  });

  // Sort exercises by frequency
  summaries.sort((a, b) => {
    return b.exercises.length - a.exercises.length;
  });

  return summaries;
}

export default async function ExercisesPage() {
  return (
    <div className="mx-auto max-w-2xl p-5 text-center">
      <h1 className="mb-5 text-4xl font-semibold">Exercises</h1>
      <ExercisesUI exerciseSummaries={await getExerciseSummary()}></ExercisesUI>
    </div>
  );
}
