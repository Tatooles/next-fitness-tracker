"use client";
import { useState } from "react";
import Modal from "../Modal";
export default function Home() {
  const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [formData, setFormData] = useState({});

  const [exerciseFields, setExerciseFields] = useState([
    { name: "input1", value: "" },
  ]);
  const [exerciseFieldCount, setExerciseFieldCount] = useState(1);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWorkouts([...workouts, formData as Workout]);
    setAddWorkoutModalOpen(false);
  };

  const handleChange = (event: any) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleExerciseInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...exerciseFields];
    values[index].value = event.target.value;
    setExerciseFields(values);
  };

  const handleAddField = () => {
    setExerciseFieldCount(exerciseFieldCount + 1);
    setExerciseFields([
      ...exerciseFields,
      { name: `input${exerciseFieldCount + 1}`, value: "" },
    ]);
  };

  const getDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Workouts</h1>
      <ul>
        {workouts.map((workout: Workout, index) => (
          <li key={index} className="mb-2 border-2 border-black">
            <h3 className="text-xl">{getDate(workout.date)}</h3>
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
        <div className="fixed top-20 left-1/2 z-10 max-h-[80%] w-4/5 translate-x-[-50%] translate-y-[-10%] overflow-scroll rounded-lg bg-white p-5">
          <h2 className="text-3xl">Add Workout</h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <>
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
              <h1 className=" border-b-2 border-black">Exercises:</h1>
              {exerciseFields.map((input, index) => (
                <div key={input.name} className="mt-2">
                  <input
                    type="text"
                    placeholder="Exercise Name"
                    name={input.name}
                    value={input.value}
                    onChange={(event) =>
                      handleExerciseInputChange(index, event)
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                className="my-4 rounded-md border-2 border-black"
                onClick={handleAddField}
              >
                Add Exercise
              </button>
              <button
                type="submit"
                className="self-center rounded-md bg-blue-400 p-2 text-white"
              >
                Submit
              </button>
            </>
          </form>
        </div>
      </Modal>
    </div>
  );
}

interface Workout {
  date: string;
  name: string;
  notes: string;
  exercises: Exercise[];
}

// Reps and sets are strings because they can be a range
interface Exercise {
  name: string;
  notes: string;
  sets: string;
  reps: string;
}
