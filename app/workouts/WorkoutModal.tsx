import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Workout } from "@/lib/types";

export default function WorkoutModal({
  modalOpen,
  setModalOpen,
  editWorkoutValue,
  setShowSpinner,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editWorkoutValue: Workout | undefined;
  setShowSpinner: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const formSchema = z.object({
    date: z.date(),
    name: z.string().min(1).max(50),
  });

  const router = useRouter();
  // This state holds the current data in the form
  const [formData, setFormData] = useState<Workout>({
    id: 0,
    userId: "",
    // TODO: Fix this, sometimes prepopulates the wrong date. I think its related to timezones
    // May need to add 7 hours to the date
    date: new Date(),
    name: "",
    exercises: [
      {
        id: 0,
        workoutId: 0,
        sets: [{ id: 0, exerciseId: 0, reps: "", weight: "" }],
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
        id: 0,
        userId: "",
        date: new Date(),
        name: "",
        exercises: [
          {
            id: 0,
            workoutId: 0,
            sets: [],
            name: "",
            notes: "",
          },
        ],
      });
    } else if (editWorkoutValue) {
      // Pre fill with a copy if editing
      setFormData(structuredClone(editWorkoutValue));
    }
  }, [modalOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // TODO: Replace this function with a server action
    event.preventDefault();
    setModalOpen(false);
    setShowSpinner(true);

    if (!editWorkoutValue || editWorkoutValue.id === -2) {
      // If adding or duplicating, just create new workout
      await addToDB();
      router.refresh();
    } else if (JSON.stringify(editWorkoutValue) !== JSON.stringify(formData)) {
      // If updating, call delete to delete the existing workout, then addToDB to add udpated one
      await Promise.all([deleteWorkout(editWorkoutValue.id), addToDB()]);
      router.refresh();
    }
    setShowSpinner(false);
  };

  const addToDB = async () => {
    await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify({
        workout: formData,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Failed to add exercise.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while adding exercise:", error);
      });
  };

  const deleteWorkout = async (id: number) => {
    await fetch(`/api/workouts/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Failed to delete exercise.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while deleting exercise:", error);
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    setFormData({ ...formData, date: selectedDate });
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
      id: 0,
      workoutId: 0,
      name: "",
      sets: [],
      notes: "",
    });
    setFormData(data);
  };

  const handleAddSet = (exerciseIndex: number) => {
    const data = { ...formData };
    data.exercises[exerciseIndex].sets.push({
      id: 0,
      exerciseId: 0,
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
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90%] w-5/6 overflow-y-scroll rounded-lg"
      >
        <DialogHeader>
          <DialogTitle>
            {editWorkoutValue ? "Edit Workout" : "Create Workout"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <Label htmlFor="date">Date:</Label>
          <Input
            type="date"
            name="date"
            onChange={handleDateChange}
            value={formData.date.toISOString().split("T")[0]}
            className="mt-2 mb-4 text-[16px]"
          ></Input>
          <Label htmlFor="name">Workout Name:</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            className="mt-2 mb-4 text-[16px]"
            onChange={handleChange}
          ></Input>
          {/* TODO: At this point would like to give the user the ability to use a template rather than filling in the whole thing manually */}
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
                  className="text-[16px]"
                  onChange={(event) =>
                    handleExerciseNameChange(exerciseIndex, event)
                  }
                  // TODO: Maybe have main exercise name (bench press, squat, deadlift) in one dropdown
                  // Then another dropdown with modifications susch a incline, low bar, pause, pin, bands, chains, etc
                ></Input>
                <div
                  onClick={() => handleRemoveExercise(exerciseIndex)}
                  className="ml-5 h-6 w-7 cursor-pointer rounded-full bg-red-600 text-center text-white"
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
                    className="w-16 text-[16px]"
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
                    className="w-20 text-[16px]"
                    onChange={(event) =>
                      handleWeightChange(exerciseIndex, setIndex, event)
                    }
                  ></Input>
                  <div
                    onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                    className="p-2"
                  >
                    <div className="h-4 w-4 cursor-pointer rounded-full bg-red-600 p-2 text-center text-white">
                      <div className="-translate-y-[13px] -translate-x-[4px]">
                        -
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddSet(exerciseIndex)}
                  className="w-20 rounded-md bg-green-500 py-1 text-sm text-white"
                >
                  New set
                </button>
                {exercise.sets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => duplicateSet(exerciseIndex)}
                    className="w-20 rounded-md bg-blue-600 py-1 text-sm text-white"
                  >
                    Clone set
                  </button>
                )}
              </div>
              <Textarea
                placeholder="Notes"
                name="notes"
                value={exercise.notes}
                className="text-[16px]"
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
          <Button type="submit" className="mt-4 self-center">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
