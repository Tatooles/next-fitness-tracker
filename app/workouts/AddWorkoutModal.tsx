import { useState } from "react";
import Modal from "../Modal";
import { Workout, Exercise } from "./page";

export default function AddWorkoutModal({
  currentWorkouts,
  setWorkouts,
  modalOpen,
  setModalOpen,
}: {
  currentWorkouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
    // TODO: Once DB is added we would use this function to update the DB
    // Or call an api route to do so
    event.preventDefault();
    const workout = formData as Workout;
    workout.exercises = exerciseFields;
    setWorkouts([...currentWorkouts, workout]);
    setModalOpen(false);

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
  return (
    <Modal isOpen={modalOpen} handleClose={() => setModalOpen(false)}>
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
                {/* TODO: This would be a search of a list of exercises */}
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
                      inputMode="decimal"
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
                  onChange={(event) => handleNotesChange(exerciseIndex, event)}
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
  );
}
