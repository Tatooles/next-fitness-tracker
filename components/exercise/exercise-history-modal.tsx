"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import useSWR from "swr";
import { GroupedExercise } from "@/app/api/exercises/history/route";
import ExerciseInstanceItem from "./exercise-instance-item";
import { Spinner } from "@/components/ui/spinner";

function getExerciseHistoryKey({
  exerciseName,
  userId,
}: {
  exerciseName: string;
  userId: string | null | undefined;
}) {
  return ["exercise-history", userId ?? "signed-out", exerciseName] as const;
}

async function getExerciseHistory(exerciseName: string) {
  const response = await fetch(
    `/api/exercises/history?name=${encodeURIComponent(exerciseName)}`,
  );

  if (!response.ok) {
    let errorMessage = `Failed to fetch data: ${response.status} ${response.statusText}`;

    try {
      const errorBody = (await response.json()) as { error?: string };
      if (errorBody.error) {
        errorMessage = errorBody.error;
      }
    } catch (jsonError) {
      console.error("Failed to parse error JSON:", jsonError);
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as GroupedExercise[];
}

export default function ExerciseHistoryModal({
  exerciseName,
  filterOutWorkoutId,
  children,
}: {
  exerciseName: string;
  filterOutWorkoutId?: number;
  children: React.ReactNode;
}) {
  const { userId } = useAuth();
  const [open, setOpen] = useState(false);
  const { data, error, isLoading } = useSWR(
    open ? getExerciseHistoryKey({ exerciseName, userId }) : null,
    () => getExerciseHistory(exerciseName),
    {
      dedupingInterval: 0,
    },
  );

  const exerciseHistory = (data ?? []).filter(
    (exercise) => exercise.workoutId !== filterOutWorkoutId,
  );
  const errorMessage =
    error instanceof Error
      ? error.message
      : "An unexpected error occurred. Please try again.";

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[80vh] w-11/12 rounded-lg p-0 sm:max-w-md">
        <DialogHeader className="border-border border-b p-4">
          <DialogTitle className="mr-4 text-xl font-semibold">
            {exerciseName} History
          </DialogTitle>
        </DialogHeader>

        <div className="flex min-h-36 items-center justify-center">
          {isLoading && (
            <div className="flex h-full items-center justify-center pt-4">
              <Spinner />
            </div>
          )}

          {!isLoading && error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-4 text-center text-sm">
              <p className="mb-1 font-semibold">Unable to Load History</p>
              <p>{errorMessage}</p>
            </div>
          )}

          {!isLoading && !error && exerciseHistory.length === 0 && (
            <p className="text-muted-foreground py-10 text-center">
              No history found for this exercise.
            </p>
          )}

          {!isLoading && !error && exerciseHistory.length > 0 && (
            <div className="max-h-[calc(80vh-8rem)] space-y-4 overflow-y-auto px-6 pb-6">
              {exerciseHistory.map((exercise: GroupedExercise) => (
                <ExerciseInstanceItem
                  exercise={exercise}
                  showName={false}
                  showDate={true}
                  key={exercise.date}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
