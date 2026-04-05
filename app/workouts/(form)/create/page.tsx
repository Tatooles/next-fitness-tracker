import WorkoutForm from "@/components/workout-form/workout-form";

export default async function CreateWorkoutPage() {
  return (
    <WorkoutForm
      persistMode="create"
      initialValues={{
        date: "",
        durationMinutes: null,
        name: "",
        notes: "",
        exercises: [
          { name: "", notes: "", sets: [{ weight: "", reps: "", rpe: "" }] },
        ],
      }}
    />
  );
}
