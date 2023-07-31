import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import ExerciseItem from "@/components/ExerciseItem";
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
                      <ExerciseItem exercise={exercise}></ExerciseItem>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent className="w-5/6">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete workout?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This action cannot be undone. This workout will be permanently
            deleted and removed from our servers.
          </AlertDialogDescription>
          <AlertDialogFooter className="flex flex-row justify-around">
            <AlertDialogCancel
              onClick={() => {
                setDeleteModalOpen(false);
                setWorkoutToDelete(-1);
              }}
              className="mt-0"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteWorkout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
