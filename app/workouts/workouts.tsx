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
    <Accordion type="single" collapsible className="space-y-2">
      {workouts.map((workout: Workout, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>
            {formatDate(workout.date)} - {workout.name}
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-6 flex justify-start space-x-3 px-1">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
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
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </Button>
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
            <div className="space-y-4">
              {workout.exercises.map((exercise: ExerciseInstance) => (
                <ExerciseInstanceItem
                  exercise={exercise}
                  showName={true}
                  showDate={false}
                  key={exercise.id}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
      <Spinner show={showSpinner} />
    </Accordion>
  );
}
