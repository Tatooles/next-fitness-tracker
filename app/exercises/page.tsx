import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import ExercisesUI from "./ExercisesUI";
import { ExerciseInstance, Set } from "@/lib/types";
import { exerciseView, sets } from "@/db/schema";
import { eq } from "drizzle-orm";

interface DateExercise extends ExerciseInstance {
  date: string;
  userId: string;
}

type ExerciseWithSets = {
  userId?: string | null;
  date?: string | null;
  id?: number | null;
  name?: string | null;
  notes?: string | null;
  workoutId?: number | null;
  sets: Set[];
};

export interface ExerciseViewData {
  userId?: string | null;
  date?: string | null;
  id?: number | null;
  name?: string | null;
  notes?: string | null;
  workoutId?: number | null;
  sets: Set[];
}

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
    // TODO: Group by name??
    // Otherwise have to do it later

    return data;
  } catch (error) {
    console.log("An error ocurred while fetching workout data", error);
    return [];
  }
}

async function getExerciseSummary() {
  const exercises = await getExercises();

  const groupedResults = exercises.reduce<ExerciseViewData[]>(
    (acc, { exercise_view, sets }) => {
      const existingExercise = acc.find((e) => e.id === exercise_view?.id);
      if (existingExercise) {
        if (sets) {
          existingExercise.sets.push(sets);
        }
      } else {
        if (sets) {
          acc.push({
            ...exercise_view,
            sets: [sets],
          });
        }
      }
      return acc;
    },
    []
  );

  console.log(groupedResults[0]);
}

export default async function ExercisesPage() {
  return (
    <ExercisesUI exerciseSummaries={await getExerciseSummary()}></ExercisesUI>
  );
}
