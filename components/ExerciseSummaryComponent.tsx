import { DateExercise, ExerciseSummary, Set } from "@/lib/types";
import { Button } from "./ui/button";

export default function ExerciseSummaryComponent({
  exerciseSummary,
}: {
  exerciseSummary: ExerciseSummary;
}) {
  // Page is hit when the accordion is opened which ideal
  // Means we are only running these calculations when the user wants them

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
    // Calculating max of every possible set seems excessive
    // But can't think of another way

    exerciseSummary.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        const setMax = calculateOneRepMax(set);
        if (setMax > max) max = setMax;
      });
    });

    return 0;
  };

  const calculateOneRepMax = (set: Set): number => {
    // TODO: Implement this

    // Could show result of all 3 formulas if I wanted to be really excessive lol
    return 0;
  };

  return (
    <div className="flex flex-col gap-2">
      <Button className="self-start text-lg">History</Button>
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
