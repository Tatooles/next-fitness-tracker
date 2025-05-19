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

  useEffect(() => {
    if (open) {
      fetch(`/api/exercises/history?name=${encodeURIComponent(exerciseName)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            return;
          }
          setExerciseHistory(
            (data as GroupedExercise[]).filter(
              (exercise) => exercise.workoutId !== filterOutWorkoutId
            )
          );
        })
        .catch((error) => {
          console.log("an error ocurred!", error);
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
      <DialogContent className="max-h-[80vh] w-11/12 sm:max-w-md rounded-lg bg-card p-0">
        <DialogHeader className="p-4">
          <DialogTitle className="text-2xl font-semibold">
            {exerciseName}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 max-h-[calc(80vh-10rem)] overflow-y-auto">
          {exerciseHistory.map((exercise: GroupedExercise) => (
            <ExerciseInstanceItem
              exercise={exercise}
              showName={false}
              showDate={true}
              key={exercise.date}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
