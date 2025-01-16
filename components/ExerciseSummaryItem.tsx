import { DateExercise, Set } from "@/lib/types";

export default function ExerciseSummaryItem({
  exercise,
}: {
  exercise: DateExercise;
}) {
  return (
    <div className="mb-6">
      <span className="text-lg">{exercise.date}</span>
      {exercise.sets.length > 0 && (
        // Could have global state (set in settings) to determine if this
        // has other columns like RPE, would need changes in the input modal too
        <div className="flex justify-around">
          <div>Reps</div>
          <div>Weight</div>
        </div>
      )}
      {exercise.sets.map(
        (set: Set, index) =>
          (set.reps || set.weight) && (
            <div key={index} className="flex justify-around">
              <div>{set.reps}</div>
              <div>{set.weight}</div>
            </div>
          )
      )}
      {exercise.notes && (
        <p className="mt-2 rounded-md bg-slate-300 p-2">{exercise.notes}</p>
      )}
    </div>
  );
}
