import {
  buildWorkoutFormSeed,
} from "@/components/workout-form/form-model";
import WorkoutForm from "@/components/workout-form/workout-form";

export default async function CreateWorkoutPage() {
  const workoutSeed = await buildWorkoutFormSeed({ kind: "create" });

  return <WorkoutForm {...workoutSeed} />;
}
