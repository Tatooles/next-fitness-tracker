"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import Spinner from "@/components/spinner";
import ExerciseInstanceItem from "@/components/exercise-instance-item";
import { Workout, ExerciseInstance } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function Workouts({ workouts }: { workouts: Workout[] }) {
  const [showSpinner, setShowSpinner] = useState(false);

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
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  return (
    <Accordion type="single" collapsible>
      {workouts.map((workout: Workout, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>
            <span className="flex w-full pr-4">
              {formatDate(workout.date)} - {workout.name}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-4 flex justify-start gap-3 py-2">
              <Button
                asChild
                className="bg-green-500 text-white hover:bg-green-500/70"
              >
                <Link
                  href={{
                    pathname: "/workouts/edit",
                    query: { id: workout.id },
                  }}
                >
                  Edit
                </Link>
              </Button>
              <Button
                asChild
                className="bg-blue-600 text-white hover:bg-blue-600/70"
              >
                <Link
                  href={{
                    pathname: "/workouts/duplicate",
                    query: { id: workout.id },
                  }}
                >
                  Duplicate
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete workout?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogDescription>
                    This action cannot be undone. This workout will be
                    permanently deleted and removed from our servers.
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteWorkout(workout.id);
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            {workout.exercises.map((exercise: ExerciseInstance) => (
              <ExerciseInstanceItem
                exercise={exercise}
                showName={true}
                showDate={false}
                key={exercise.id}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
      <Spinner show={showSpinner} />
    </Accordion>
  );
}
