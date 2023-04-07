"use client";
import { useState } from "react";
import Modal from "../Modal";
import Workouts from "./Workouts";
export default function Home() {
  const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [formData, setFormData] = useState({});

  const [exerciseFields, setExerciseFields] = useState<Exercise[]>([
    {
      name: "",
      sets: [{ reps: "", weight: "" }],
      reps: "",
      notes: "",
    },
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const workout = formData as Workout;
    workout.exercises = exerciseFields;
    setWorkouts([...workouts, workout]);
    setAddWorkoutModalOpen(false);

    // Reset Exercises
    setExerciseFields([
      {
        name: "",
        sets: [{ reps: "", weight: "" }],
        reps: "",
        notes: "",
      },
    ]);
  };

  const handleChange = (event: any) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleExerciseNameChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const exercises = [...exerciseFields];
    exercises[index].name = event.target.value;
    setExerciseFields(exercises);
  };

  const handleRepsChange = (
    exerciseIndex: number,
    setIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const exercises = [...exerciseFields];
    const sets = exercises[exerciseIndex].sets;
    sets[setIndex].reps = event.target.value;
    exercises[exerciseIndex].sets = sets;
    setExerciseFields(exercises);
  };

  const handleWeightChange = (
    exerciseIndex: number,
    setIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const exercises = [...exerciseFields];
    const sets = exercises[exerciseIndex].sets;
    sets[setIndex].weight = event.target.value;
    exercises[exerciseIndex].sets = sets;
    setExerciseFields(exercises);
  };

  const handleNotesChange = (
    exerciseIndex: number,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const exercises = [...exerciseFields];
    exercises[exerciseIndex].notes = event.target.value;
    setExerciseFields(exercises);
  };

  const handleAddExercise = () => {
    setExerciseFields([
      ...exerciseFields,
      {
        name: "",
        sets: [{ reps: "", weight: "" }],
        reps: "",
        notes: "",
      },
    ]);
  };

  const handleAddSet = (exerciseIndex: number) => {
    // Need to update just this exercise to have an extra set
    const exercises = [...exerciseFields];
    exercises[exerciseIndex].sets.push({
      reps: "",
      weight: "",
    });
    setExerciseFields(exercises);
  };

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Workouts</h1>
      <Workouts workouts={workouts}></Workouts>
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
              <h1 className=" border-b-2 border-black">Exercises:</h1>
              {exerciseFields.map((exercise, exerciseIndex) => (
                <div
                  key={exerciseIndex}
                  className="mt-2 mb-5 flex flex-col gap-4"
                >
                  <input
                    type="text"
                    placeholder="Exercise Name"
                    value={exercise.name}
                    onChange={(event) =>
                      handleExerciseNameChange(exerciseIndex, event)
                    }
                  />
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="flex justify-between">
                      <h3>Set {setIndex + 1}:</h3>
                      <input
                        type="text"
                        placeholder="Reps"
                        value={set.reps}
                        className=" w-16"
                        onChange={(event) =>
                          handleRepsChange(exerciseIndex, setIndex, event)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Weight"
                        value={set.weight}
                        className=" w-16"
                        onChange={(event) =>
                          handleWeightChange(exerciseIndex, setIndex, event)
                        }
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddSet(exerciseIndex)}
                    className="w-20 rounded-md bg-green-500 py-1 px-2 text-sm text-white"
                  >
                    Add Set
                  </button>
                  <textarea
                    placeholder="Notes"
                    value={exercise.notes}
                    onChange={(event) =>
                      handleNotesChange(exerciseIndex, event)
                    }
                  />
                </div>
              ))}
              <button
                type="button"
                className="my-4 rounded-md border-2 border-black"
                onClick={handleAddExercise}
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

export interface Workout {
  date: string;
  name: string;
  exercises: Exercise[];
}

// Reps and sets are strings because they can be a range
export interface Exercise {
  sets: Set[];
  name: string;
  notes: string;
  reps: string;
}

export interface Set {
  reps: string;
  weight: string;
}
