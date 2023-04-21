import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Modal from "../../components/Modal";
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
    if (!modalOpen) {
      // Clear modal on close
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
    } else if (editWorkoutIndex != -1) {
      // Pre fill if editing
      setFormData(currentWorkouts[editWorkoutIndex]);
    }
  }, [modalOpen]);

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

  const handleRemoveExercise = (exerciseIndex: number) => {
    const data = { ...formData };
    data.exercises.splice(exerciseIndex, 1);
    setFormData(data);
  };

  /**
   * Duplicate the last set of the given exercise
   */
  const duplicateSet = (exerciseIndex: number) => {
    const data = { ...formData };
    const sets = data.exercises[exerciseIndex].sets;
    sets.push({ ...sets[sets.length - 1] });
    setFormData(data);
  };

  return (
    <Modal isOpen={modalOpen} handleClose={() => setModalOpen(false)}>
      <div className="fixed top-20 left-1/2 z-10 max-h-[80%] w-4/5 translate-x-[-50%] translate-y-[-10%] overflow-scroll rounded-lg bg-white p-5">
        <h2 className="mb-3 text-center text-3xl font-medium leading-none">
          Add Workout
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <Label htmlFor="date">Date:</Label>
          <Input
            type="date"
            name="date"
            onChange={handleChange}
            value={formData.date}
            className="mt-2 mb-4 w-36"
          ></Input>
          <Label htmlFor="name">Workout Name:</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            className="mt-2 mb-4"
            onChange={handleChange}
          ></Input>
          <Label>Exercises:</Label>
          {formData.exercises.map((exercise, exerciseIndex) => (
            <div
              key={exerciseIndex}
              className="flex flex-col gap-4 border-b-2 border-slate-700 px-2 py-4"
            >
              {/* TODO: This would be a search of a list of exercises */}
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Exercise Name"
                  name="exerciseName"
                  value={exercise.name}
                  className="w-48"
                  onChange={(event) =>
                    handleExerciseNameChange(exerciseIndex, event)
                  }
                  // TODO: Maybe have main exercise name (bench press, squat, deadlift) in one dropdown
                  // Then another dropdown with modifications susch a incline, low bar, pause, pin, bands, chains, etc
                ></Input>
                <div
                  onClick={() => handleRemoveExercise(exerciseIndex)}
                  className="ml-5 h-6 w-6 cursor-pointer rounded-full bg-red-600 text-center text-white"
                >
                  <div className="-translate-y-[1px]">-</div>
                </div>
              </div>
              {exercise.sets.map((set, setIndex) => (
                <div
                  key={setIndex}
                  className="flex items-center justify-between"
                >
                  <h3>Set {setIndex + 1}:</h3>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Reps"
                    name="reps"
                    value={set.reps}
                    className="w-16"
                    onChange={(event) =>
                      handleRepsChange(exerciseIndex, setIndex, event)
                    }
                  ></Input>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Weight"
                    name="weight"
                    value={set.weight}
                    className="w-20"
                    onChange={(event) =>
                      handleWeightChange(exerciseIndex, setIndex, event)
                    }
                  ></Input>
                  <div
                    onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                    className="h-4 w-4 cursor-pointer rounded-full bg-red-600 text-center text-white"
                  >
                    <div className="-translate-y-[5px]">-</div>
                  </div>
                </div>
              ))}
              {exercise.sets.length > 0 && (
                <button
                  type="button"
                  onClick={() => duplicateSet(exerciseIndex)}
                  className="w-36 rounded-md bg-blue-600 py-1 text-sm text-white"
                >
                  Duplicate previous
                </button>
              )}
              <button
                type="button"
                onClick={() => handleAddSet(exerciseIndex)}
                className="w-20 rounded-md bg-green-500 py-1 text-sm text-white"
              >
                Add Set
              </button>
              <Textarea
                placeholder="Notes"
                name="notes"
                value={exercise.notes}
                onChange={(event) =>
                  handleExerciseNotesChange(exerciseIndex, event)
                }
              ></Textarea>
            </div>
          ))}
          <Button
            variant="secondary"
            type="button"
            className="mt-4"
            onClick={handleAddExercise}
          >
            Add Exercise
          </Button>
          <Button
            type="submit"
            className="mt-4 self-center bg-blue-400 text-white"
          >
            Submit
          </Button>
        </form>
      </div>
    </Modal>
  );
}
