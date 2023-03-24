"use client";
import { useState } from "react";
import Modal from "../Modal";
export default function Home() {
  const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);

  // This is our full list of workouts
  const [workouts, setWorkouts] = useState<Object[]>([]);
  const [formData, setFormData] = useState({});

  // One useState for each field in the input modal

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setWorkouts([...workouts, formData]);
    setAddWorkoutModalOpen(false);
  };

  const handleChange = (event: any) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
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
          <form onSubmit={handleSubmit} className="flex flex-col items-start">
            <label htmlFor="date">Date:</label>
            <input
              className="mb-5 bg-gray-200"
              type="date"
              id="date"
              name="date"
              onChange={handleChange}
            />
            <label htmlFor="name">Workout Name:</label>
            <input
              className="mb-5 bg-gray-200"
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
            />
            <label htmlFor="notes">Notes:</label>
            <textarea
              className="mb-5 bg-gray-200"
              name="notes"
              id="notes"
              cols={30}
              rows={10}
              onChange={handleChange}
            ></textarea>
            <button className="self-center rounded-md bg-blue-400 p-2 text-white">
              Submit
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
