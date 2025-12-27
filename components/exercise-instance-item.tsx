import { DateExercise, Set } from "@/lib/types";
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
    <div className="border-border overflow-hidden rounded-lg border shadow-xs">
      {(showName || showDate) && (
        <div className="border-border border-b p-4">
          {showName && (
            <h3 className="text-card-foreground text-xl font-semibold">
              {name}
            </h3>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {showDate && (
              <p className="text-muted-foreground text-sm">
                {date ? formatDate(date) : "Date not available"}
              </p>
            )}
            {workoutName && (
              <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
                {workoutName}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="p-4">
        {sets.length > 0 && (
          <div className="mt-2">
            {/* Header Row */}
            <div className="border-border text-muted-foreground mb-2 flex border-b pb-2 text-sm font-medium">
              <div className="w-1/3 px-1 text-center">Weight</div>
              <div className="w-1/3 px-1 text-center">Reps</div>
              <div className="w-1/3 px-1 text-center">RPE</div>
            </div>
            {/* Data Rows */}
            {sets.map(
              (set: Set, index) =>
                (set.reps || set.weight || set.rpe) && (
                  <div key={index} className="flex py-1.5 text-sm">
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
          <div className="mt-3">
            <p className="text-muted-foreground rounded-md p-2 text-start text-sm whitespace-pre-wrap sm:px-10">
              {notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
