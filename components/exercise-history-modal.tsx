import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { GroupedExercise } from "@/app/api/exercises/history/route";
import ExerciseInstanceItem from "./exercise-instance-item";
import { History } from "lucide-react";
import Spinner from "@/components/spinner";

export default function ExerciseHistoryModal({
  exerciseName,
  filterOutWorkoutId,
}: {
  exerciseName: string;
  filterOutWorkoutId?: number;
}) {
  const [open, setOpen] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState<GroupedExercise[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setExerciseHistory([]);
      setError("");

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
                (exercise) => exercise.workoutId !== filterOutWorkoutId
              )
            );
          }
        })
        .catch((err) => {
          console.error(
            "An error occurred while fetching exercise history:",
            err
          );
          setError(
            err.message || "An unexpected error occurred. Please try again."
          );
          setExerciseHistory([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, exerciseName, filterOutWorkoutId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <History className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] w-11/12 sm:max-w-md rounded-lg p-0">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold mr-4">
            {exerciseName} History
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center items-center min-h-36">
          {loading && (
            <div className="flex justify-center items-center h-full pt-4">
              <Spinner show={true} />
            </div>
          )}

          {!loading && error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm text-center">
              <p className="font-semibold mb-1">Unable to Load History</p>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && exerciseHistory.length === 0 && (
            <p className="text-muted-foreground text-center py-10">
              No history found for this exercise.
            </p>
          )}

          {!loading && !error && exerciseHistory.length > 0 && (
            <div className="px-6 pb-6 max-h-[calc(80vh-8rem)] overflow-y-auto space-y-4">
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
