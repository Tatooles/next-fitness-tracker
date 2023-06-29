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

  const getDate = (date: Date | null) => {
    if (date) {
      return new Date(date).toLocaleDateString();
    }
  };

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
              <div className="p-2 text-left">{getDate(workout.date)}</div>
              <div className="divide-y-2 px-2">
                {workout.exercises.map((exercise: Exercise, index2) => (
                  <Exercise exercise={exercise} key={index2}></Exercise>
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

function Exercise({ exercise }: { exercise: Exercise }) {
  return (
    <div className="p-2 text-left">
      <h3 className="self-center text-center text-lg font-bold">
        {exercise.name}
      </h3>

      {exercise.sets.length > 0 && (
        // Could have global state (set in settings) to determine if this
        // has other columns like RPE, would need changes in the input modal too
        <div className="flex justify-around">
          <div>Reps</div>
          <div>Weight</div>
        </div>
      )}
      {exercise.sets.map(
        (set: Set, index3) =>
          (set.reps || set.weight) && (
            <div key={index3} className="flex justify-around">
              <div>{set.reps}</div>
              <div>{set.weight}</div>
            </div>
          )
      )}
      {exercise.notes && (
        <p className="mt-2 rounded-md bg-slate-300 p-2">{exercise.notes}</p>
      )}
    </div>
  );
}
