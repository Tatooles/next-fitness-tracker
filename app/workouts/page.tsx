"use client";
import { useState } from "react";
import Modal from "../Modal";
export default function Home() {
  const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  /**
   * TODO: Start fleshing out the workouts page
   * For now just store the workouts in state, store in the db later
   * Create a modal to enter the info
   * Display the list of workouts
   */
  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Workouts</h1>
      <button
        onClick={() => setAddWorkoutModalOpen(true)}
        className="rounded-md bg-gray-500 p-2 text-white"
      >
        Add a Workout
      </button>
      <Modal
        isOpen={addWorkoutModalOpen}
        handleClose={() => setAddWorkoutModalOpen(false)}
      >
        <div className="fixed top-20 left-1/2 z-10 w-4/5 translate-x-[-50%] translate-y-[-10%] rounded-lg bg-white p-5 text-center">
          <h2 className="text-3xl">Add Workout</h2>
        </div>
      </Modal>
    </div>
  );
}
