import { useState, useEffect } from "react";
import Modal from "../Modal";
import { Workout, Exercise } from "./page";

export default function WorkoutModal({
  currentWorkouts,
  setWorkouts,
  modalOpen,
  setModalOpen,
  editWorkoutId,
}: {
  currentWorkouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editWorkoutId: number;
}) {
  const [formData, setFormData] = useState<Workout>({
    id: 0,
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
  const [workoutId, setWorkoutId] = useState(0);

  /**
   * Condiaitonally fill formData based on whether
   * we are in add mode or edit mode
   */
  useEffect(() => {
    if (editWorkoutId != -1) {
      // Pre fill
      let workout = currentWorkouts[editWorkoutId];
      console.log("prefilling modal");
      // setFormData(currentWorkouts[editWorkoutId]);
      setFormData(workout);
    } else {
      setFormData({
        id: 0,
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
  }, [editWorkoutId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // TODO: Once DB is added we would use this function to update the DB
    // Or call an api route to do so
    event.preventDefault();

    const workout = formData;

    if (editWorkoutId === -1) {
      // If adding, just add new workout on to the end
      workout.id = workoutId;
      setWorkouts([...currentWorkouts, workout]);
      setWorkoutId(workoutId + 1);
    } else {
      // If editing, update workout at correct index
      const workouts = [...currentWorkouts];
      workouts[editWorkoutId] = workout;
      setWorkouts(workouts);
    }

    setModalOpen(false);
  };

  const handleChange = (event: any) => {
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
              value={formData.date}
              onChange={handleChange}
            />
            <label htmlFor="name">Workout Name:</label>
            <input
              className="mb-5 bg-gray-200"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <h1 className=" border-b-2 border-black">Exercises:</h1>
            {formData.exercises.map((exercise, exerciseIndex) => (
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
                  // TODO: Maybe have main exercise name (bench press, squat, deadlift) in one dropdown
                  // Then another dropdown with modifications susch a incline, low bar, pause, pin, bands, chains, etc
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
          </>
        </form>
      </div>
    </Modal>
  );
}
