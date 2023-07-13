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
import { Workout, Exercise, Set } from "@/lib/types";

export default function Workouts({
  workouts,
  editWorkout,
}: {
  workouts: Workout[];
  editWorkout: (workout: Workout) => void;
}) {
  const router = useRouter();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(-1);
  const [workoutToDuplicate, setWorkoutToDuplicate] = useState(-1);

  const deleteWorkout = async () => {
    await fetch(`/api/workouts/${workoutToDelete}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setWorkoutToDelete(-1);
          setDeleteModalOpen(false);
          router.refresh();
        } else {
          console.log("Failed to delete exercise.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while deleting exercise:", error);
      });
  };

  const duplicateWorkout = () => {
    // May be faster to just pass the entire workout to state rather than finding it
    const workout = workouts.find(
      (workout) => workout.id === workoutToDuplicate
    );
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
          set.weight = "";
        }
      }
      setDuplicateModalOpen(false);
      editWorkout(workoutCopy);
    }
  };

  workouts.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Accordion type="single" collapsible className="mb-5">
      {workouts.map((workout: Workout, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>
            <span>
              {workout.date.toLocaleDateString()} - {workout.name}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex justify-start">
              <Button
                onClick={() => editWorkout(workout)}
                className="mr-4 bg-green-500"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  setDuplicateModalOpen(true);
                  setWorkoutToDuplicate(workout.id);
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
                className=""
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
      <Modal
        isOpen={duplicateModalOpen}
        handleClose={() => setDuplicateModalOpen(false)}
      >
        <div className="fixed top-1/3 left-1/2 z-10 max-h-[80%] w-56 translate-x-[-50%] overflow-scroll rounded-lg bg-white p-5 text-center">
          Duplicate Workout?
          {/* TODO: Does this really need a confirmation modal? */}
          <div className="mt-4 flex justify-around">
            <Button
              variant="outline"
              onClick={() => {
                setDuplicateModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button className="bg-blue-600 " onClick={duplicateWorkout}>
              Duplicate
            </Button>
          </div>
        </div>
      </Modal>
    </Accordion>
  );
}
