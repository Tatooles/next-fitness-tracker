"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import WorkoutModal from "./WorkoutModal";
import Workouts from "./Workouts";
import { Workout } from "@/lib/types";
import Spinner from "@/components/Spinner";

export default function WorkoutUI({ workouts }: { workouts: Workout[] }) {
  const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);

  const [showSpinner, setShowSpinner] = useState(false);

  const [editWorkoutValue, setEditWorkoutValue] = useState<Workout | undefined>(
    undefined
  );

  const addWorkout = () => {
    setEditWorkoutValue(undefined);
    setAddWorkoutModalOpen(true);
  };

  const editWorkout = (workout: Workout) => {
    setEditWorkoutValue(workout);
    setAddWorkoutModalOpen(true);
  };

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Workouts</h1>
      <Button onClick={addWorkout}>Add a Workout</Button>
      <Workouts workouts={workouts} editWorkout={editWorkout}></Workouts>
      <WorkoutModal
        modalOpen={addWorkoutModalOpen}
        setModalOpen={setAddWorkoutModalOpen}
        editWorkoutValue={editWorkoutValue}
      ></WorkoutModal>
      <Spinner show={showSpinner}></Spinner>
    </div>
  );
}
