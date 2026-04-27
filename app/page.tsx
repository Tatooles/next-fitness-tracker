import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Dumbbell, ListChecks } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-8 sm:px-8 lg:py-12">
      <header className="max-w-3xl">
        <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
          Training Log
        </p>
        <h1 className="text-foreground mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          Lift, log, repeat.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7">
          A focused workspace for recording workouts, reviewing exercise
          history, and keeping the details tight between sessions.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="min-h-64 justify-between">
          <CardHeader>
            <div className="bg-primary text-primary-foreground mb-4 flex size-11 items-center justify-center rounded-md">
              <Dumbbell className="size-5" />
            </div>
            <CardTitle className="text-2xl">Workouts</CardTitle>
            <CardDescription>
              Create sessions, edit details, duplicate previous days, and keep
              notes close to the work.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="border-border/70 bg-secondary/70 rounded-md border p-3">
              Sets
            </div>
            <div className="border-border/70 bg-secondary/70 rounded-md border p-3">
              Notes
            </div>
            <div className="border-border/70 bg-secondary/70 rounded-md border p-3">
              Time
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full">
              <Link href="/workouts">Open Workouts</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="min-h-64 justify-between">
          <CardHeader>
            <div className="border-primary/40 bg-primary/15 text-primary mb-4 flex size-11 items-center justify-center rounded-md border">
              <ListChecks className="size-5" />
            </div>
            <CardTitle className="text-2xl">Exercises</CardTitle>
            <CardDescription>
              Scan movement history, compare top sets, and review exercise
              performance across workouts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="border-border/70 bg-secondary/70 flex justify-between rounded-md border p-3">
              <span className="text-muted-foreground">Heaviest rep</span>
              <span className="text-foreground font-semibold">Tracked</span>
            </div>
            <div className="border-border/70 bg-secondary/70 flex justify-between rounded-md border p-3">
              <span className="text-muted-foreground">Calculated 1RM</span>
              <span className="text-foreground font-semibold">Estimated</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/exercises">Open Exercises</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
