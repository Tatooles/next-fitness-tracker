import WorkoutForm from "@/app/workouts/(form)/workout-form";

export const dynamic = "force-dynamic";

export default async function CreateWorkoutPage() {
  return (
    <WorkoutForm
      editMode={false}
      workoutId={-1}
      workoutValue={{
        date: new Date().toLocaleDateString("en-CA"),
        name: "",
        exercises: [
          { name: "", notes: "", sets: [{ weight: "", reps: "", rpe: "" }] },
        ],
      }}
    ></WorkoutForm>
  );
}
