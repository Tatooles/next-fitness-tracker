import WorkoutForm from "@/app/workouts/WorkoutForm";

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
