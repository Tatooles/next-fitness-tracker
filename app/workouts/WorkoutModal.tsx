import { useState, useEffect } from "react";
import Modal from "../Modal";
import { Workout } from "./page";

export default function WorkoutModal({
  currentWorkouts,
  setWorkouts,
  modalOpen,
  setModalOpen,
  editWorkoutIndex,
}: {
  currentWorkouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editWorkoutIndex: number;
}) {
  // This state holds the current data in the form
  const [formData, setFormData] = useState<Workout>({
    date: "",
    name: "",
    exercises: [
      {
        sets: [{ reps: "", weight: "" }],
        name: "",
        notes: "",
      },
    ],
  });

  /**
   * Conditionally fill formData based on whether
   * we are in add mode or edit mode
   */
  useEffect(() => {
    if (editWorkoutIndex != -1) {
      // Pre fill
      setFormData(currentWorkouts[editWorkoutIndex]);
    } else {
      setFormData({
        date: "",
        name: "",
        exercises: [
          {
            sets: [],
            name: "",
            notes: "",
          },
        ],
      });
    }
  }, [editWorkoutIndex]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // TODO: Once DB is added we would use this function to update the DB
    // Or call an api route to do so
    event.preventDefault();
    const workouts = [...currentWorkouts];

    if (editWorkoutIndex < 0) {
      // If adding, just add new workout on to the end
      workouts.push(formData);
    } else {
      // If editing, update workout at correct index
      workouts[editWorkoutIndex] = formData;
    }

    setWorkouts(workouts);
    setModalOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleExerciseNameChange = (
    exerciseIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const data = { ...formData };
    const exercise = data.exercises[exerciseIndex];
    exercise.name = event.target.value;
    data.exercises[exerciseIndex] = exercise;
    setFormData(data);
  };

  const handleExerciseNotesChange = (
    exerciseIndex: number,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const data = { ...formData };
    const exercise = data.exercises[exerciseIndex];
    exercise.notes = event.target.value;
    data.exercises[exerciseIndex] = exercise;
    setFormData(data);
  };

  const handleRepsChange = (
    exerciseIndex: number,
    setIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const data = { ...formData };
    const set = data.exercises[exerciseIndex].sets[setIndex];
    set.reps = event.target.value;
    setFormData(data);
  };

  const handleWeightChange = (
    exerciseIndex: number,
    setIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const data = { ...formData };
    const set = data.exercises[exerciseIndex].sets[setIndex];
    set.weight = event.target.value;
    setFormData(data);
  };

  const handleAddExercise = () => {
    const data = { ...formData };
    data.exercises.push({
      name: "",
      sets: [],
      notes: "",
    });
    setFormData(data);
  };

  const handleAddSet = (exerciseIndex: number) => {
    const data = { ...formData };
    data.exercises[exerciseIndex].sets.push({
      reps: "",
      weight: "",
    });
    setFormData(data);
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const data = { ...formData };
    data.exercises[exerciseIndex].sets.splice(setIndex, 1);
    setFormData(data);
  };

  return (
    <Modal isOpen={modalOpen} handleClose={() => setModalOpen(false)}>
      <div className="fixed top-20 left-1/2 z-10 max-h-[80%] w-4/5 translate-x-[-50%] translate-y-[-10%] overflow-scroll rounded-lg bg-white p-5">
        <h2 className="text-3xl">Add Workout</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label htmlFor="date">Date:</label>
          <input
            className="mb-5 bg-gray-200"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          <label htmlFor="name">Workout Name:</label>
          <input
            className="mb-5 bg-gray-200"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <h1 className=" border-b-2 border-black">Exercises:</h1>
          {formData.exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="mt-2 mb-5 flex flex-col gap-4">
              {/* TODO: This would be a search of a list of exercises */}
              <input
                type="text"
                placeholder="Exercise Name"
                name="exerciseName"
                value={exercise.name}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                onChange={(event) =>
                  handleExerciseNameChange(exerciseIndex, event)
                }
                // TODO: Maybe have main exercise name (bench press, squat, deadlift) in one dropdown
                // Then another dropdown with modifications susch a incline, low bar, pause, pin, bands, chains, etc
              />
              {exercise.sets.map((set, setIndex) => (
                <div
                  key={setIndex}
                  className="flex items-center justify-between"
                >
                  <h3>Set {setIndex + 1}:</h3>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Reps"
                    name="reps"
                    value={set.reps}
                    className="flex h-10 w-16 rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                    onChange={(event) =>
                      handleRepsChange(exerciseIndex, setIndex, event)
                    }
                  />
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Weight"
                    name="weight"
                    value={set.weight}
                    className="flex h-10 w-20 rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                    onChange={(event) =>
                      handleWeightChange(exerciseIndex, setIndex, event)
                    }
                  />
                  <div
                    onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                    className="h-4 w-4 cursor-pointer rounded-full bg-red-600 text-center text-white"
                  >
                    <div className="-translate-y-[5px]">-</div>
                  </div>
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
                name="notes"
                value={exercise.notes}
                className="flex h-20 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(event) =>
                  handleExerciseNotesChange(exerciseIndex, event)
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
        </form>
      </div>
    </Modal>
  );
}
