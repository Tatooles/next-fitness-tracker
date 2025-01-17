import { DateExercise, ExerciseSummary, Set } from "@/lib/types";
import { Button } from "./ui/button";

export default function ExerciseSummaryComponent({
  exerciseSummary,
}: {
  exerciseSummary: ExerciseSummary;
}) {
  const calculateWeightLifted = (): number => {
    let maxWeight = 0;

    exerciseSummary.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (+set.weight > maxWeight) maxWeight = +set.weight;
      });
    });

    return maxWeight;
  };

  const calculateOneRepMax = (): number => {
    // Calculating max of every possible set seems excessive
    // But can't think of another way
    return 0;
  };

  return (
    <div className="flex flex-col gap-2">
      <Button className="self-start text-lg">History</Button>
      <div className="self-start text-xl mb-4">
        <span className="mr-4">Heaviest rep</span>
        <span className="p-2 rounded-md  bg-amber-300">
          {calculateWeightLifted()} lb
        </span>
      </div>
      <div className="self-start text-xl">
        <span className="mr-4">Calculated 1RM</span>
        <span className="p-2 rounded-md  bg-amber-300">
          {calculateOneRepMax()} lb
        </span>
      </div>
    </div>
  );
}
