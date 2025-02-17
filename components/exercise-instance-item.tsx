import { DateExercise, Set } from "@/lib/types";

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
    <div className="p-2 mt-4 text-center">
      {showName && <h3 className="text-lg font-bold">{name}</h3>}
      {showDate && <h3 className="text-lg text-center">{date}</h3>}
      <div className="mt-4">
        {sets.length > 0 && (
          <div className="flex justify-around">
            <div className="flex-1">Reps</div>
            <div className="flex-1">Weight</div>
            <div className="flex-1">RPE</div>
          </div>
        )}
        {sets.map(
          (set: Set, index) =>
            (set.reps || set.weight) && (
              <div key={index} className="flex justify-around">
                <div className="flex-1">{set.reps}</div>
                <div className="flex-1">{set.weight}</div>
                <div className="flex-1">{set.rpe}</div>
              </div>
            )
        )}
      </div>
      {notes && (
        <p className="mt-2 rounded-md dark:text-black bg-slate-300 p-2 text-start">
          {notes}
        </p>
      )}
    </div>
  );
}
