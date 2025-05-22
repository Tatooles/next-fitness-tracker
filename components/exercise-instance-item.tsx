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
  const { name, date, sets, notes } = exercise;

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      {(showName || showDate) && (
        <div className="p-4 border-b border-border">
          {showName && (
            <h3 className="text-xl font-semibold text-card-foreground">
              {name}
            </h3>
          )}
          {showDate && (
            <p className="text-sm text-muted-foreground">
              {date ? formatDate(date) : "Date not available"}
            </p>
          )}
        </div>
      )}
      <div className="p-4">
        {sets.length > 0 && (
          <div className="mt-2">
            {/* Header Row */}
            <div className="flex pb-2 mb-2 border-b border-border font-medium text-sm text-muted-foreground">
              <div className="w-1/3 text-center px-1">Weight</div>
              <div className="w-1/3 text-center px-1">Reps</div>
              <div className="w-1/3 text-center px-1">RPE</div>
            </div>
            {/* Data Rows */}
            {sets.map(
              (set: Set, index) =>
                (set.reps || set.weight || set.rpe) && (
                  <div key={index} className="flex py-1.5 text-sm">
                    <div className="w-1/3 text-center px-1">
                      {set.weight || "-"}
                    </div>
                    <div className="w-1/3 text-center px-1">
                      {set.reps || "-"}
                    </div>
                    <div className="w-1/3 text-center px-1">
                      {set.rpe || "-"}
                    </div>
                  </div>
                )
            )}
          </div>
        )}
        {notes && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap p-2 rounded-md">
              {notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
