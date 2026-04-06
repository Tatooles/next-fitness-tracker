import {
  buildWorkoutFormSeed,
} from "@/components/workout-form/form-model";
import WorkoutForm from "@/components/workout-form/workout-form";
import WorkoutNotFound from "@/components/workout-form/workout-not-found";

export default async function DuplicateWorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (isNaN(+id)) {
    return <WorkoutNotFound />;
  }

  const workoutSeed = await buildWorkoutFormSeed({
    kind: "duplicate",
    workoutId: +id,
  });

  if (!workoutSeed) {
    return <WorkoutNotFound />;
  }

  return <WorkoutForm {...workoutSeed} />;
}
