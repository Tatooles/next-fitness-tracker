import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { GroupedExercise } from "@/app/api/exercises/history/route";
import ExerciseInstanceItem from "./exercise-instance-item";
import { Spinner } from "@/components/ui/spinner";

export default function ExerciseHistoryModal({
  exerciseName,
  filterOutWorkoutId,
  children,
}: {
  exerciseName: string;
  filterOutWorkoutId?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState<GroupedExercise[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setLoading(true);
      setExerciseHistory([]);
      setError("");
    }
  };

  useEffect(() => {
    if (open) {
      fetch(`/api/exercises/history?name=${encodeURIComponent(exerciseName)}`)
        .then(async (res) => {
          if (!res.ok) {
            let errorMessage = `Failed to fetch data: ${res.status} ${res.statusText}`;
            try {
              const errData = await res.json();
              if (errData && errData.error) {
                errorMessage = errData.error;
              }
            } catch (jsonError) {
              console.error("Failed to parse error JSON:", jsonError);
            }
            throw new Error(errorMessage);
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setExerciseHistory([]);
          } else {
            setExerciseHistory(
              (data as GroupedExercise[]).filter(
                (exercise) => exercise.workoutId !== filterOutWorkoutId,
              ),
            );
          }
        })
        .catch((err) => {
          console.error(
            "An error occurred while fetching exercise history:",
            err,
          );
          setError(
            err.message || "An unexpected error occurred. Please try again.",
          );
          setExerciseHistory([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, exerciseName, filterOutWorkoutId]);

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
          {loading && (
            <div className="flex h-full items-center justify-center pt-4">
              <Spinner />
            </div>
          )}

          {!loading && error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-4 text-center text-sm">
              <p className="mb-1 font-semibold">Unable to Load History</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && exerciseHistory.length === 0 && (
            <p className="text-muted-foreground py-10 text-center">
              No history found for this exercise.
            </p>
          )}

          {!loading && !error && exerciseHistory.length > 0 && (
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
