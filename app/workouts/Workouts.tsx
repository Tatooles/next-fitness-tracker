import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import ExerciseUI from "@/components/ExerciseUI";
import { Workout, Exercise } from "@/lib/types";

export default function Workouts({
  workouts,
  editWorkout,
  setShowSpinner,
}: {
  workouts: Workout[];
  editWorkout: (workout: Workout) => void;
  setShowSpinner: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(-1);

  const deleteWorkout = async () => {
    setDeleteModalOpen(false);
    setShowSpinner(true);
    await fetch(`/api/workouts/${workoutToDelete}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          router.refresh();
        } else {
          console.error("Failed to delete exercise.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while deleting exercise:", error);
      });
    setWorkoutToDelete(-1);
    setShowSpinner(false);
  };

  const duplicateWorkout = (workout: Workout) => {
    if (workout) {
      const workoutCopy = structuredClone(workout);
      // Set id to -2 so submit logic knows it's duplicate
      workoutCopy.id = -2;
      workoutCopy.date = new Date();
      workoutCopy.name = `Copy of ${workout.name}`;
      // Clear all weight and notes for new workout
      for (const exercise of workoutCopy.exercises) {
        exercise.notes = "";
        for (const set of exercise.sets) {
          // TODO: Just copy first (or last) set
          set.weight = "";
        }
      }
      editWorkout(workoutCopy);
    }
  };

  workouts.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <>
      <Accordion type="single" collapsible className="mb-5 mt-2">
        {workouts.map((workout: Workout, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>
              <span>
                {workout.date.toLocaleDateString()} - {workout.name}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-start pt-2">
                <Button
                  onClick={() => editWorkout(workout)}
                  className="mr-4 bg-green-500"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    duplicateWorkout(workout);
                  }}
                  className="mr-4 bg-blue-600"
                >
                  Duplicate
                </Button>
                <Button
                  onClick={() => {
                    setDeleteModalOpen(true);
                    setWorkoutToDelete(workout.id);
                  }}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
              <div className="text-center">
                <div className="divide-y-2 px-2">
                  {workout.exercises.map((exercise: Exercise) => (
                    <div className="p-2" key={exercise.id}>
                      <h3 className="text-lg font-bold">{exercise.name}</h3>
                      <ExerciseUI exercise={exercise}></ExerciseUI>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Modal
        isOpen={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
      >
        <div className="fixed top-1/3 left-1/2 z-10 max-h-[80%] w-56 translate-x-[-50%] overflow-scroll rounded-lg bg-white p-5 text-center">
          Delete workout?
          <div className="mt-4 flex justify-around">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setWorkoutToDelete(-1);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteWorkout}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
