import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WorkoutNotFound() {
  return (
    <div className="mx-auto flex-col p-4 text-center sm:max-w-md">
      <p className="text-left mb-4">
        Workout not found, please return to the Workouts page
      </p>
      <Button>
        <Link href="/workouts">Workouts</Link>
      </Button>
    </div>
  );
}
