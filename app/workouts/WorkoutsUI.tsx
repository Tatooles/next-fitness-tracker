"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import WorkoutModal from "./WorkoutModal";
import Workouts from "./Workouts";
import { TWorkoutFormSchema, Workout } from "@/lib/types";
import Spinner from "@/components/Spinner";

export default function WorkoutsUI({ workouts }: { workouts: Workout[] }) {
  const emptyWorkout = {
    date: new Date().toISOString().substring(0, 10),
    name: "",
    exercises: [{ name: "", notes: "", sets: [{ reps: "", weight: "" }] }],
  };

  const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);

  const [showSpinner, setShowSpinner] = useState(false);

  const [workoutValue, setWorkoutValue] =
    useState<TWorkoutFormSchema>(emptyWorkout);

  const [editWorkoutId, setEditWorkoutId] = useState(-1);

  const addWorkout = () => {
    setWorkoutValue(emptyWorkout);
    setEditWorkoutId(-1);
    setAddWorkoutModalOpen(true);
  };

  const editWorkout = (workout: TWorkoutFormSchema) => {
    setWorkoutValue(workout);
    setAddWorkoutModalOpen(true);
  };

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Workouts</h1>
      <Button>
        <Link href="/workouts/create">Add Workout</Link>
      </Button>
      <Workouts
        workouts={workouts}
        editWorkout={editWorkout}
        setEditWorkoutId={setEditWorkoutId}
        setShowSpinner={setShowSpinner}
      ></Workouts>
      <WorkoutModal
        modalOpen={addWorkoutModalOpen}
        setModalOpen={setAddWorkoutModalOpen}
        workoutValue={workoutValue}
        editWorkoutId={editWorkoutId}
        setShowSpinner={setShowSpinner}
      ></WorkoutModal>
      <Spinner show={showSpinner}></Spinner>
    </div>
  );
}
