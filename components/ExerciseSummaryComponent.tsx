import { DateExercise, ExerciseSummary, Set } from "@/lib/types";
import { Button } from "./ui/button";

export default function ExerciseSummaryComponent({
  exerciseSummary,
}: {
  exerciseSummary: ExerciseSummary;
}) {
  // Gotta run some calculations
  // I guess they will be done on the client
  const maxWeightLifted = (): number => {
    let maxWeight = 0;

    exerciseSummary.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (+set.weight > maxWeight) maxWeight = +set.weight;
      });
    });

    return maxWeight;
  };
  return (
    <div className="flex flex-col gap-2">
      <Button className="self-start">History</Button>
      <span className="self-start text-xl">
        Heaviest rep {maxWeightLifted()}
      </span>
      <span className="self-start text-xl">Calculated 1RM {}</span>
    </div>
  );
}
