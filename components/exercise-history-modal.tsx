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

          // Filter out workout based on prop
          setExerciseHistory(
            (data as GroupedExercise[]).filter(
              (data) => data.workoutId !== filterOutWorkoutId
            )
          );
        })
        .catch((error) => {
          console.log("an error ocurred!", error);
        });
    }
  }, [open, exerciseName]);

  return (
    <div className="self-start">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="text-lg">History</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] w-11/12 rounded-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{exerciseName}</DialogTitle>
          </DialogHeader>
          <div className=" text-center text-red-600">{error}</div>
          <div className="divide-y-2">
            {exerciseHistory.map((exercise: GroupedExercise) => (
              <ExerciseInstanceItem
                exercise={exercise}
                showName={false}
                showDate={true}
                key={exercise.date}
              ></ExerciseInstanceItem>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
