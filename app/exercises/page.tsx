import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/session";
import ExercisesUI from "@/components/exercise/exercises-ui";
import { getExerciseSummaryForUser } from "@/app/exercises/data";

async function getExerciseSummary() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return getExerciseSummaryForUser(session.userId ?? 0);
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