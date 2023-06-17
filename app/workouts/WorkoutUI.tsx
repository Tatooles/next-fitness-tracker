"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import WorkoutModal from "./WorkoutModal";
import Workouts from "./Workouts";

export default function WorkoutUI({ workouts }: { workouts: any }) {
  const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);

  // Index for the workout currently being edited in the edit modal
  // Currently tracking workout to edit based on index, in the future may want to go back and use an id for more precision
  const [editWorkoutIndex, setEditWorkoutIndex] = useState(-1);

  const addWorkout = () => {
    // Set variable so we know not to edit
    setEditWorkoutIndex(-1);
    setAddWorkoutModalOpen(true);
  };

  const editWorkout = (index: number) => {
    // Set value for which workout to edit
    setEditWorkoutIndex(index);
    setAddWorkoutModalOpen(true);
  };

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Workouts</h1>
      <Workouts workouts={workouts} editWorkout={editWorkout}></Workouts>
      <Button onClick={addWorkout}>Add a Workout</Button>
      <WorkoutModal
        currentWorkouts={workouts}
        modalOpen={addWorkoutModalOpen}
        setModalOpen={setAddWorkoutModalOpen}
        editWorkoutIndex={editWorkoutIndex} // TODO: Disable editing for initial release
      ></WorkoutModal>
    </div>
  );
}
