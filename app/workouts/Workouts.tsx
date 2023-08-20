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
import { Workout, Exercise, TWorkoutFormSchema } from "@/lib/types";

export default function Workouts({
  workouts,
  editWorkout,
  setShowSpinner,
}: {
  workouts: Workout[];
  editWorkout: (workout: TWorkoutFormSchema) => void;
  setShowSpinner: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const deleteWorkout = async (workout: number) => {
    setShowSpinner(true);
    await fetch(`/api/workouts/${workout}`, {
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
      // TODO: Convert this to zod version?
      // editWorkout(workoutCopy);
    }
  };

  const convertToFormType = (workout: Workout) => {
    // TODO: Time this operation, with slow cpu as well

    const convertedExercises = workout.exercises.map((exercise) => ({
      name: exercise.name,
      notes: exercise.notes,
      sets: exercise.sets.map((set) => ({
        reps: set.reps,
        weight: set.weight,
      })),
    }));

    const convertedWorkout: TWorkoutFormSchema = {
      name: workout.name,
      date: workout.date.toISOString(),
      exercises: convertedExercises,
    };

    editWorkout(convertedWorkout);
  };

  workouts.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
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
                onClick={() => convertToFormType(workout)}
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-5/6">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete workout?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogDescription>
                    This action cannot be undone. This workout will be
                    permanently deleted and removed from our servers.
                  </AlertDialogDescription>
                  <AlertDialogFooter className="flex flex-row justify-around">
                    <AlertDialogCancel className="mt-0">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteWorkout(workout.id);
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
  );
}
