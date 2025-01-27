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

  const groupedResults = exercises.reduce<ExerciseSummary[]>(
    (acc, { exercise_view, sets }) => {
      // Find an existing group by exercise name
      let group = acc.find((g) => g.name === exercise_view?.name);

      if (!group) {
        // Create a new group if it doesn't exist
        group = { name: exercise_view?.name!, exercises: [] };
        acc.push(group);
      }

      // Find an existing exercise in the group (by ID)
      let existingExercise = group.exercises.find(
        (e) => e.id === exercise_view?.id
      );

      if (!existingExercise) {
        // Add the exercise to the group with its initial set
        existingExercise = { ...exercise_view, sets: sets ? [sets] : [] };
        group.exercises.push(existingExercise);
      } else if (sets) {
        // Add the set to the existing exercise
        existingExercise.sets.push(sets);
      }

      return acc;
    },
    []
  );

  return groupedResults;
}

export default async function ExercisesPage() {
  return (
    <ExercisesUI exerciseSummaries={await getExerciseSummary()}></ExercisesUI>
  );
}
