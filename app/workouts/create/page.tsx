import WorkoutForm from "@/app/workouts/WorkoutForm";
import { ComboboxDemo } from "@/components/exercise-combobox";

export default async function CreateWorkoutPage() {
  return (
    <ComboboxDemo></ComboboxDemo>
    // <WorkoutForm
    //   editMode={false}
    //   workoutId={-1}
    //   workoutValue={{
    //     date: new Date().toLocaleDateString("en-CA"),
    //     name: "",
    //     exercises: [
    //       { name: "", notes: "", sets: [{ weight: "", reps: "", rpe: "" }] },
    //     ],
    //   }}
    // ></WorkoutForm>
  );
}
