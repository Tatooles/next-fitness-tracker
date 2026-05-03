import ExerciseHistoryModal from "@/components/exercise/exercise-history-modal";
import type { ExerciseSummary, Set } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ExerciseSummaryComponent({
  exerciseSummary,
}: {
  exerciseSummary: ExerciseSummary;
}) {
  const getHeaviestRep = (): { weight: number; date: string | null } => {
    let heaviest = 0;
    let heaviestDate: string | null = null;

    exerciseSummary.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (+set.weight > heaviest) {
          heaviest = +set.weight;
          heaviestDate = exercise.date || null;
        }
      });
    });

    return { weight: heaviest, date: heaviestDate };
  };

  const getMax = (): { weight: number; date: string | null } => {
    let max = 0;
    let maxDate: string | null = null;

    exerciseSummary.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        const setMax = calculateOneRepMax(set);
        if (setMax > max) {
          max = setMax;
          maxDate = exercise.date || null;
        }
      });
    });

    return { weight: Math.round(max), date: maxDate };
  };

  const calculateOneRepMax = (set: Set): number => {
    const reps = +set.reps;
    const weight = +set.weight;
    if (isNaN(reps) || isNaN(weight)) {
      return 0;
    }

    if (reps === 1) {
      return weight;
    } else if (reps < 6) {
      // Brzycki formula.
      return weight / (1.0278 - 0.0278 * reps);
    } else if (reps < 11) {
      // Epley formula.
      return weight * (1 + reps / 30);
    } else {
      // Lombardi formula.
      return weight * Math.pow(reps, 0.1);
    }
  };

  const heaviestRep = getHeaviestRep();
  const maxOneRep = getMax();

  return (
    <div className="flex flex-col gap-4">
      <ExerciseHistoryModal exerciseName={exerciseSummary.name}>
        <Button variant="outline" className="w-full">
          <History />
          View Exercise History
        </Button>
      </ExerciseHistoryModal>
      <SummaryItem
        label="Heaviest rep"
        value={heaviestRep.weight}
        date={heaviestRep.date}
        unit="lb"
      />
      <SummaryItem
        label="Calculated 1RM"
        value={maxOneRep.weight}
        date={maxOneRep.date}
        unit="lb"
      />
    </div>
  );
}

function SummaryItem({
  label,
  value,
  unit,
  date,
}: {
  label: string;
  value: string | number;
  unit?: string;
  date?: string | null;
}) {
  return (
    <div className="border-border/70 bg-secondary/70 flex items-center justify-between rounded-lg border p-3">
      <span className="text-muted-foreground text-sm font-medium">{label}</span>
      <span className="border-primary/30 bg-primary/12 text-foreground rounded-full border px-3 py-1 text-sm font-semibold">
        {value} {unit && unit}
        {date && (
          <>
            <span className="mx-1.5 opacity-50">•</span>
            <span className="text-xs font-medium opacity-75">
              {formatDate(date)}
            </span>
          </>
        )}
      </span>
    </div>
  );
}
