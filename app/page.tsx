import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-4 text-center sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight sm:mb-12 sm:text-5xl">
        Track Your Strength Journey
      </h1>
      <div className="flex flex-col justify-center gap-6 sm:flex-row sm:gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">
              Log Your Workouts
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Effortlessly create, view, and manage your training sessions. Record
            every set, rep, and note to stay on top of your game.
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/workouts">View Workouts</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl">
              Analyze Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Dive into your exercise history. Compare performances, visualize
            your strength gains, and stay motivated.
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/exercises">View Exercises</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
