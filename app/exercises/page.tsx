import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import ExercisesUI from "@/components/exercise/exercises-ui";
import { ExerciseSummary } from "@/lib/types";
import { exercise, workout, set } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getExercises() {
  try {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) redirectToSignIn();

    const exerciseData = await db
      .select()
      .from(exercise)
      .innerJoin(workout, eq(exercise.workoutId, workout.id))
      .leftJoin(set, eq(set.exerciseId, exercise.id))
      .where(eq(workout.userId, userId!));

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
  exercises.forEach((row) => {
    const { exercise, workout, set } = row;
    if (!exercise?.name) return;

    let exerciseSummary = summaries.find((g) => g.name === exercise.name);

    if (!exerciseSummary) {
      // Create new exercise summary if it doesn't exist
      exerciseSummary = { name: exercise.name, exercises: [] };
      summaries.push(exerciseSummary);
    }

    const exerciseInstance = exerciseSummary.exercises.find(
      (e) => e.id === exercise.id,
    );

    if (!exerciseInstance) {
      // Create new exercise instance if it doesn't exist
      exerciseSummary.exercises.push({
        id: exercise.id,
        name: exercise.name,
        notes: exercise.notes,
        workoutId: exercise.workoutId,
        date: workout.date,
        userId: workout.userId,
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
      <ExercisesUI exerciseSummaries={await getExerciseSummary()} />
    </div>
  );
}
