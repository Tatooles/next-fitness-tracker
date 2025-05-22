import ExerciseHistoryModal from "@/components/exercise-history-modal";
import { ExerciseSummary, Set } from "@/lib/types";

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
    <div className="flex flex-col gap-4 p-2">
      <ExerciseHistoryModal exerciseName={exerciseSummary.name} />
      <SummaryItem label="Heaviest rep" value={getHeaviestRep()} unit="lb" />
      <SummaryItem label="Calculated 1RM" value={getMax()} unit="lb" />
    </div>
  );
}

function SummaryItem({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <span className="px-2.5 py-0.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-700 dark:text-amber-100">
        {value} {unit && unit}
      </span>
    </div>
  );
}
