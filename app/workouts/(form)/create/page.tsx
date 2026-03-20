import WorkoutForm from "@/components/workout-form/workout-form";

export default async function CreateWorkoutPage() {
  return (
    <WorkoutForm
      editMode={false}
      workoutId={-1}
      workoutValue={{
        date: "",
        durationMinutes: null,
        name: "",
        notes: "",
        exercises: [
          { name: "", notes: "", sets: [{ weight: "", reps: "", rpe: "" }] },
        ],
      }}
    ></WorkoutForm>
  );
}
