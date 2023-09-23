import Link from "next/link";

export default function WorkoutNotFound() {
  return (
    <div className="mx-auto flex flex-col p-4 text-center sm:max-w-md">
      <p className="text-left">
        Workout not found, please return to the Workouts page
      </p>
      <Link
        className="mx-auto mt-2 rounded-md bg-slate-500 p-2 text-white hover:bg-slate-500/70"
        href="/workouts"
      >
        Workouts
      </Link>
    </div>
  );
}
