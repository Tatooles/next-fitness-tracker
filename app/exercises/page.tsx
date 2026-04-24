import { auth } from "@clerk/nextjs/server";
import ExercisesUI from "@/components/exercise/exercises-ui";
import { getExerciseSummaryForUser } from "@/lib/exercise-summary";

async function getExerciseSummary() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn();
  }

  try {
    return await getExerciseSummaryForUser(userId!);
  } catch (error) {
    console.error("Failed to fetch exercises", error);
    return [];
  }
}

export default async function ExercisesPage() {
  return (
    <div className="mx-auto max-w-2xl p-5 text-center">
      <h1 className="mb-5 text-4xl font-semibold">Exercises</h1>
      <ExercisesUI exerciseSummaries={await getExerciseSummary()} />
    </div>
  );
}
