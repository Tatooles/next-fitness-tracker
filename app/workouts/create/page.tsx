import WorkoutForm from "@/app/workouts/WorkoutForm";

export default async function CreateWorkoutPage() {
  return (
    <WorkoutForm
      editMode={false}
      workoutId={-1}
      workoutValue={{
        date: new Date().toISOString().substring(0, 10),
        name: "",
        exercises: [{ name: "", notes: "", sets: [{ reps: "", weight: "" }] }],
      }}
    ></WorkoutForm>
  );
}
