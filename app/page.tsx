import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 sm:mb-12 tracking-tight">
        Track Your Strength Journey
      </h1>
      <div className="flex flex-col justify-center gap-6 sm:gap-8 sm:flex-row">
        <div className="bg-card text-card-foreground rounded-xl shadow-xl p-6 sm:p-8 max-w-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
            Log Your Workouts
          </h2>
          <p className="mb-8 text-muted-foreground">
            Effortlessly create, view, and manage your training sessions. Record
            every set, rep, and note to stay on top of your game.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/workouts">View Workouts</Link>
          </Button>
        </div>
        <div className="bg-card text-card-foreground rounded-xl shadow-xl p-6 sm:p-8 max-w-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
            Analyze Your Progress
          </h2>
          <p className="mb-8 text-muted-foreground">
            Dive into your exercise history. Compare performances, visualize
            your strength gains, and stay motivated.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/exercises">View Exercises</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
