import type { DateExercise, Set } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function ExerciseInstanceItem({
  exercise,
  showName,
  showDate,
}: {
  exercise: DateExercise;
  showName: boolean;
  showDate: boolean;
}) {
  const { name, date, sets, notes, workoutName } = exercise;

  return (
    <div className="border-border/80 bg-card overflow-hidden rounded-lg border shadow-xs shadow-black/20">
      {(showName || showDate) && (
        <div className="border-border/80 bg-secondary/35 border-b p-4">
          {showName && (
            <h3 className="text-card-foreground text-xl font-semibold">
              {name}
            </h3>
          )}
          <div className="flex items-center gap-2">
            {showDate && (
              <p className="text-muted-foreground text-sm">
                {date ? formatDate(date) : "Date not available"}
              </p>
            )}
            {workoutName && (
              <span className="border-primary/30 bg-primary/12 text-primary max-w-[180px] truncate rounded-full border px-2.5 py-0.5 text-xs font-medium">
                {workoutName}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="p-4">
        {sets.length > 0 && (
          <div className="mt-2">
            <div className="border-border/80 text-muted-foreground mb-2 flex border-b pb-2 text-sm font-medium">
              <div className="w-1/3 px-1 text-center">Weight</div>
              <div className="w-1/3 px-1 text-center">Reps</div>
              <div className="w-1/3 px-1 text-center">RPE</div>
            </div>
            {sets.map(
              (set: Set, index) =>
                (set.reps || set.weight || set.rpe) && (
                  <div
                    key={index}
                    className="odd:bg-secondary/35 flex rounded-md py-1.5 text-sm"
                  >
                    <div className="w-1/3 px-1 text-center">
                      {set.weight || "-"}
                    </div>
                    <div className="w-1/3 px-1 text-center">
                      {set.reps || "-"}
                    </div>
                    <div className="w-1/3 px-1 text-center">
                      {set.rpe || "-"}
                    </div>
                  </div>
                ),
            )}
          </div>
        )}
        {notes && (
          <div className={sets.length > 0 ? "mt-3" : ""}>
            <p className="text-muted-foreground rounded-md p-2 text-start text-sm whitespace-pre-wrap">
              {notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
