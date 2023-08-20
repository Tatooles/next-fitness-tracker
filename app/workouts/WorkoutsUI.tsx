"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import WorkoutModal from "./WorkoutModal";
import Workouts from "./Workouts";
import { TWorkoutFormSchema, Workout } from "@/lib/types";
import Spinner from "@/components/Spinner";

export default function WorkoutsUI({ workouts }: { workouts: Workout[] }) {
  const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);

  const [showSpinner, setShowSpinner] = useState(false);

  const [workoutValue, setWorkoutValue] = useState<TWorkoutFormSchema>({
    date: new Date().toISOString(),
    name: "",
    exercises: [{ name: "", notes: "", sets: [{ reps: "", weight: "" }] }],
  });

  const addWorkout = () => {
    setWorkoutValue({
      date: new Date().toISOString(),
      name: "",
      exercises: [{ name: "", notes: "", sets: [{ reps: "", weight: "" }] }],
    });
    setAddWorkoutModalOpen(true);
  };

  const editWorkout = (workout: TWorkoutFormSchema) => {
    setWorkoutValue(workout);
    setAddWorkoutModalOpen(true);
  };

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Workouts</h1>
      <Button onClick={addWorkout}>Add a Workout</Button>
      <Workouts
        workouts={workouts}
        editWorkout={editWorkout}
        setShowSpinner={setShowSpinner}
      ></Workouts>
      <WorkoutModal
        modalOpen={addWorkoutModalOpen}
        setModalOpen={setAddWorkoutModalOpen}
        workoutValue={workoutValue}
        setShowSpinner={setShowSpinner}
      ></WorkoutModal>
      <Spinner show={showSpinner}></Spinner>
    </div>
  );
}
