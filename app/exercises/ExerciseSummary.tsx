import { DateExercise, ExerciseSummary, Set } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../components/ui/button";
import ExerciseInstanceItem from "../../components/ExerciseInstanceItem";

export default function ExerciseSummaryComponent({
  exerciseSummary,
}: {
  exerciseSummary: ExerciseSummary;
}) {
  const getHeaviestRep = (): number => {
    let heaviest = 0;

    exerciseSummary.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (+set.weight > heaviest) heaviest = +set.weight;
      });
    });

    return heaviest;
  };

  const getMax = (): number => {
    let max = 0;

    exerciseSummary.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        const setMax = calculateOneRepMax(set);
        if (setMax > max) max = setMax;
      });
    });

    return Math.round(max);
  };

  const calculateOneRepMax = (set: Set): number => {
    let reps = +set.reps;
    let weight = +set.weight;
    if (isNaN(reps) || isNaN(weight)) {
      return 0;
    }

    if (reps === 1) {
      return weight;
    } else if (reps < 6) {
      // Use Brzycki
      return weight / (1.0278 - 0.0278 * reps);
    } else if (reps < 11) {
      // Use Epley
      return weight * (1 + reps / 30);
    } else {
      // Use lombardi
      return weight * Math.pow(reps, 0.1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="self-start">
        <Dialog>
          <DialogTrigger>
            <Button className="text-lg">History</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">
                {exerciseSummary.name} History
              </DialogTitle>
            </DialogHeader>
            {exerciseSummary.exercises.map((exercise: DateExercise) => (
              <div key={exercise.id}>
                <h3 className="text-lg">{exercise.date}</h3>
                <ExerciseInstanceItem
                  exercise={exercise}
                ></ExerciseInstanceItem>
              </div>
            ))}
          </DialogContent>
        </Dialog>
      </div>
      <div className="self-start text-xl mb-4">
        <span className="mr-4">Heaviest rep</span>
        <span className="p-2 rounded-md  bg-amber-300">
          {getHeaviestRep()} lb
        </span>
      </div>
      <div className="self-start text-xl">
        <span className="mr-4">Calculated 1RM</span>
        <span className="p-2 rounded-md  bg-amber-300">{getMax()} lb</span>
      </div>
    </div>
  );
}
