"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
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
import { LoadingOverlay } from "@/components/loading-overlay";
import { Spinner } from "@/components/ui/spinner";
import ExerciseInstanceItem from "@/components/exercise/exercise-instance-item";
import { Workout, WorkoutSummary } from "@/lib/types";
import { formatDate, formatWorkoutDuration } from "@/lib/utils";
import { copyWorkoutToClipboard } from "@/lib/workout-utils";
import { Copy, Files, Pencil, Trash2 } from "lucide-react";

function getAccordionItemValue(workoutId: number) {
  return `workout-${workoutId}`;
}

function getWorkoutDetailsKey(workoutId: number) {
  return `workout-details:${workoutId}`;
}

async function fetchWorkoutDetails(workoutId: number) {
  const response = await fetch(`/api/workouts/${workoutId}`);

  if (!response.ok) {
    let errorMessage = `Failed to load workout: ${response.status} ${response.statusText}`;

    try {
      const errorBody = (await response.json()) as { error?: string };
      if (errorBody.error) {
        errorMessage = errorBody.error;
      }
    } catch (error) {
      console.error("Failed to parse workout error response:", error);
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as Workout;
}

function WorkoutDetails({
  workout,
  isOpen,
  onDelete,
}: {
  workout: WorkoutSummary;
  isOpen: boolean;
  onDelete: (workoutId: number) => Promise<void>;
}) {
  const { data, error, isLoading, mutate } = useSWR(
    isOpen ? getWorkoutDetailsKey(workout.id) : null,
    () => fetchWorkoutDetails(workout.id),
    {
      dedupingInterval: 0,
    },
  );
  const errorMessage =
    error instanceof Error ? error.message : "Failed to load workout details.";
  const duration = formatWorkoutDuration(
    typeof workout.durationMinutes === "number"
      ? workout.durationMinutes
      : null,
  );

  const handleCopyWorkout = () => {
    if (!data) {
      return;
    }

    copyWorkoutToClipboard(data);
  };

  return (
    <AccordionItem key={workout.id} value={getAccordionItemValue(workout.id)}>
      <AccordionTrigger>
        {formatDate(workout.date)} - {workout.name}
      </AccordionTrigger>
      <AccordionContent>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex flex-wrap justify-start gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            >
              <Link
                href={`/workouts/edit/${workout.id}`}
                aria-label="Edit workout"
              >
                <Pencil aria-hidden="true" />
                <span className="hidden sm:inline">Edit</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <Link
                href={`/workouts/duplicate/${workout.id}`}
                aria-label="Duplicate workout"
              >
                <Files aria-hidden="true" />
                <span className="hidden sm:inline">Duplicate</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
              onClick={handleCopyWorkout}
              aria-label="Copy workout to clipboard"
              disabled={!data}
            >
              <Copy aria-hidden="true" />
              <span className="hidden sm:inline">Copy</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  aria-label="Delete workout"
                >
                  <Trash2 aria-hidden="true" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete workout?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  This action cannot be undone. This workout will be permanently
                  deleted and removed from our servers.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onDelete(workout.id).catch((error) => {
                        console.error(
                          "An error occurred while deleting exercise:",
                          error,
                        );
                      });
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {duration.trim() ? (
            <div className="text-muted-foreground text-sm font-medium">
              Duration: {duration}
            </div>
          ) : null}
        </div>
        {workout.notes.trim() && (
          <div className="border-border mb-4 rounded-lg border p-4">
            <p className="text-muted-foreground text-left text-sm leading-6 whitespace-pre-wrap">
              {workout.notes}
            </p>
          </div>
        )}
        {isLoading && (
          <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
            <Spinner className="size-5" />
            <span>Loading workout details...</span>
          </div>
        )}
        {!isLoading && error && (
          <div className="space-y-3 rounded-lg border border-red-200 p-4 text-center">
            <p className="text-sm text-red-600">{errorMessage}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                mutate().catch((retryError) => {
                  console.error(
                    "An error occurred while loading workout details:",
                    retryError,
                  );
                });
              }}
            >
              Retry
            </Button>
          </div>
        )}
        {!isLoading && !error && data ? (
          <div className="space-y-4">
            {data.exercises.map((exercise) => (
              <ExerciseInstanceItem
                exercise={exercise}
                showName={true}
                showDate={false}
                key={exercise.id}
              />
            ))}
          </div>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function Workouts({ workouts }: { workouts: WorkoutSummary[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [openAccordionItem, setOpenAccordionItem] = useState("");

  const router = useRouter();

  const handleAccordionValueChange = (value: string) => {
    setOpenAccordionItem(value);
  };

  const deleteWorkout = async (workoutId: number) => {
    setIsLoading(true);
    await fetch(`/api/workouts/${workoutId}`, {
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
        setIsLoading(false);
      });
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="space-y-2"
      value={openAccordionItem}
      onValueChange={handleAccordionValueChange}
    >
      {workouts.map((workout) => {
        const isWorkoutOpen =
          openAccordionItem === getAccordionItemValue(workout.id);

        return (
          <WorkoutDetails
            key={workout.id}
            workout={workout}
            isOpen={isWorkoutOpen}
            onDelete={deleteWorkout}
          />
        );
      })}
      <LoadingOverlay isLoading={isLoading} />
    </Accordion>
  );
}
