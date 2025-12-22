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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 sm:mb-12 tracking-tight">
        Track Your Strength Journey
      </h1>
      <div className="flex flex-col justify-center gap-6 sm:gap-8 sm:flex-row">
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
