"use client";
import { useState } from "react";
import Modal from "../Modal";
export default function Home() {
  const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);

  const [workouts, setWorkouts] = useState<Object[]>([]);
  const [formData, setFormData] = useState({});

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

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Workouts</h1>
      <ul>
        {workouts.map((workout: any, index) => (
          <li key={index} className="mb-2 border-2 border-black">
            <h3 className="text-xl">{workout.date}</h3>
            <p>{workout.name}</p>
            <p>{workout.notes}</p>
          </li>
        ))}
      </ul>
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
        <div className="fixed top-20 left-1/2 z-10 w-4/5 translate-x-[-50%] translate-y-[-10%] rounded-lg bg-white p-5">
          <h2 className="text-3xl">Add Workout</h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
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
            {/* TODO: Allow the user to add exercises */}
            <label htmlFor="notes">Notes:</label>
            <textarea
              className="mb-5 bg-gray-200"
              name="notes"
              id="notes"
              cols={10}
              rows={5}
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
