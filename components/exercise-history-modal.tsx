import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import ExerciseInstanceItem from "./ExerciseInstanceItem";
import { DateExercise, ExerciseSummary } from "@/lib/types";

export default function ExerciseHistoryModal({
  exerciseSummary,
}: {
  exerciseSummary: ExerciseSummary;
}) {
  return (
    <div className="self-start">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="text-lg">History</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] w-11/12 rounded-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {exerciseSummary.name}
            </DialogTitle>
          </DialogHeader>
          <div className="divide-y-2">
            {exerciseSummary.exercises.map((exercise: DateExercise) => (
              <ExerciseInstanceItem
                exercise={exercise}
                key={exercise.id}
                showName={false}
                showDate={true}
              ></ExerciseInstanceItem>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
