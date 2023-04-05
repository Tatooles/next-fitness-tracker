"use client";
import { useState } from "react";
import Modal from "../Modal";
export default function Home() {
  const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [formData, setFormData] = useState({});

  const [exerciseFields, setExerciseFields] = useState<Exercise[]>([
    {
      key: 1,
      name: "",
      sets: [{ key: 1, reps: "", weight: "" }],
      reps: "",
      notes: "",
    },
  ]);
  const [exerciseFieldCount, setExerciseFieldCount] = useState(1);
  const [setFieldCount, setSetFieldCount] = useState<Number[]>([1]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const workout = formData as Workout;
    workout.exercises = exerciseFields;
    setWorkouts([...workouts, workout]);
    setAddWorkoutModalOpen(false);

    // Reset Exercises
    // setExerciseFields([{ key: 1, name: "", sets: "", reps: "", notes: "" }]);
    // setExerciseFieldCount(1);
    console.log(workouts);
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
    // Need to set sets to the full value of the currently changed set
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

  const handleAddField = () => {
    setExerciseFieldCount(exerciseFieldCount + 1);
    setExerciseFields([
      ...exerciseFields,
      {
        key: exerciseFieldCount + 1,
        name: "",
        sets: [{ key: 1, reps: "", weight: "" }],
        reps: "",
        notes: "",
      },
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
          // TODO: Display exercises and sets for each workout, will need nested loops
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
              <h1 className=" border-b-2 border-black">Exercises:</h1>
              {exerciseFields.map((exercise, exerciseIndex) => (
                <div
                  key={exercise.key}
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
                  {/* TODO: Another loop here for sets */}
                  {exercise.sets.map((set, setIndex) => (
                    <div key={set.key} className="flex justify-between">
                      <h3>Set {set.key}:</h3>
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
                  <button className="w-20 rounded-md bg-green-500 py-1 px-2 text-sm text-white">
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
  sets: Set[];
  key: number;
  name: string;
  notes: string;
  reps: string;
}

interface Set {
  reps: string;
  weight: string;
  key: number;
}
