import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 sm:mb-12 tracking-tight">
        Welcome to the Lifting Log!
      </h1>
      <div className="flex flex-col justify-center gap-6 sm:gap-8 sm:flex-row">
        <div className="bg-card text-card-foreground rounded-xl shadow-xl p-6 sm:p-8 max-w-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Workouts</h2>
          <p className="mb-8 text-muted-foreground">
            Create, view and edit your workouts. Log all your sets and reps, as
            well as any notes you have about your workout.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/workouts">View Workouts</Link>
          </Button>
        </div>
        <div className="bg-card text-card-foreground rounded-xl shadow-xl p-6 sm:p-8 max-w-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Exercises</h2>
          <p className="mb-8 text-muted-foreground">
            See all your exercises in one place, compare the same exercise
            across different days to see your progress.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/exercises">View Exercises</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
