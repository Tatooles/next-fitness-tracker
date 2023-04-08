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
      sets: [],
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
        sets: [],
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
        sets: [],
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

  const addTestWorkout = () => {
    const workout = {
      date: "2023-04-07",
      name: "Volume Lower",
      exercises: [
        {
          name: "Sled Drag",
          sets: [
            {
              reps: "",
              weight: "",
            },
          ],
          reps: "",
          notes:
            "Gym too packed for this shit smh, should prob use the machine.",
        },
        {
          name: "Hack Squat",
          sets: [
            {
              reps: "10",
              weight: "215",
            },
            {
              reps: "10",
              weight: "215",
            },
            {
              reps: "10",
              weight: "215",
            },
          ],
          reps: "",
          notes:
            "1 plate pretty hard, feel like my quads need more warmup. First set pretty tough, can def feel that I'm targeting glutes which is good. This is likely because feet are pretty far forward on the pad. Second set also pretty hard. Not feeling a big pump so maybe need less weight more reps",
        },
        {
          name: "Good Morning",
          sets: [
            {
              reps: "10",
              weight: "135",
            },
            {
              reps: "10",
              weight: "145",
            },
            {
              reps: "10",
              weight: "155",
            },
          ],
          reps: "",
          notes:
            "Going low bar beltless with normal foot width. feel pretty confident about 135 . 135 very solid. Lower back a bit sore after first set. Not sure about effect of elevated heel shoes on these. Maybe more lower back? Second set kinda the same but thinking maybe I have more hamstring rom and lower back is the limiter, which honestly is probably better. Gonna send 155",
        },
        {
          name: "Standing Calf Raise",
          sets: [
            {
              reps: "15",
              weight: "35",
            },
            {
              reps: "15",
              weight: "35",
            },
            {
              reps: "15",
              weight: "35",
            },
          ],
          reps: "",
          notes:
            "Gonna try 35. 4s up and down for 15 first set but needed a regrip with feet, cadence pretty good. Sale pause second set, later reps also definitely slower. Got 15 last set too but same thing as the ones before. Also note that shoulder placement on the pad matters",
        },
      ],
    };
    setWorkouts([workout]);
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
      <button
        onClick={addTestWorkout}
        className={`mt-10 rounded-md bg-yellow-300 p-1 ${
          workouts.length ? "hidden" : ""
        }`}
      >
        Add Test Workout (for debugging)
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
                        inputMode="numeric"
                        placeholder="Reps"
                        value={set.reps}
                        className="w-16"
                        onChange={(event) =>
                          handleRepsChange(exerciseIndex, setIndex, event)
                        }
                      />
                      <input
                        type="text"
                        inputMode="numeric"
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
