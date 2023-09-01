import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="p-4 text-center">
      <h1 className="mb-5 text-2xl">Welcome to the Lifting Log!</h1>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <div className="border-2 border-black p-3">
          <h1 className="text-lg font-bold">Workouts</h1>
          <p className="mb-2">
            Create, view and edit your workouts. Log all your sets and reps, as
            well as any notes you have about your workout.
          </p>
          <Button>
            <Link href="/workouts">View Workouts</Link>
          </Button>
        </div>
        <div className="border-2 border-black p-3">
          <h1 className="text-lg font-bold">Exercises</h1>
          <p className="mb-2">
            See all your exercises in one place, compare the same exercise
            across different days to see your progress.
          </p>
          <Button>
            <Link href="/exercises">View Exercises</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
