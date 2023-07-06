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

  const [modalOpen, setModalOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(-1);

  const deleteWorkout = async () => {
    await fetch(`/api/workouts/${workoutToDelete}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setWorkoutToDelete(-1);
          setModalOpen(false);
          router.refresh();
        } else {
          console.log("Failed to delete exercise.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while deleting exercise:", error);
      });
  };

  workouts.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Accordion type="single" collapsible className="mb-5">
      {workouts.map((workout: Workout, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{workout.name}</AccordionTrigger>
          <AccordionContent>
            <Button
              onClick={() => {
                setModalOpen(true);
                setWorkoutToDelete(workout.id);
              }}
              className="absolute right-5 py-1 px-2"
              variant="destructive"
            >
              Delete
            </Button>
            <div onClick={() => editWorkout(workout)}>
              <div className="p-2 text-left">
                {workout.date.toLocaleDateString()}
              </div>
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
      <Modal isOpen={modalOpen} handleClose={() => setModalOpen(false)}>
        <div className="fixed top-1/3 left-1/2 z-10 max-h-[80%] w-56 translate-x-[-50%] overflow-scroll rounded-lg bg-white p-5 text-center">
          Delete workout?
          <div className="mt-4 flex justify-around">
            <Button
              variant="outline"
              onClick={() => {
                setModalOpen(false);
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
    </Accordion>
  );
}
