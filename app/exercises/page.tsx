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
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-5 py-6 sm:px-8">
      <div>
        <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
          Movement History
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Exercises</h1>
      </div>
      <ExercisesUI exerciseSummaries={await getExerciseSummary()} />
    </div>
  );
}
