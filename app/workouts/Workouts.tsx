import { Workout, Exercise, Set } from "./page";

export default function Workouts({
  workouts,
  editWorkout,
}: {
  workouts: Workout[];
  editWorkout: any;
}) {
  const getDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <ul>
      {workouts.map((workout: Workout, index) => (
        // TODO: This will be an accordion with only the name and date showing when closed
        <li
          onClick={() => editWorkout(index)}
          key={index}
          className="mb-2 border-2 border-black"
        >
          <h2 className="p-2 text-left text-xl">{workout.name}</h2>
          <h3 className="text-md -mt-2 border-b-2 border-black p-2 text-left">
            {getDate(workout.date)}
          </h3>
          <div className="divide-y-2 px-2">
            {workout.exercises.map((exercise: Exercise, index2) => (
              <Exercise exercise={exercise} key={index2}></Exercise>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Exercise({ exercise }: { exercise: Exercise }) {
  return (
    <div className="border-black p-2 text-left">
      <h3 className="self-center text-center text-lg font-bold">
        {exercise.name}
      </h3>

      {exercise.sets.length > 0 && (
        // Could have global state (set in settings) to determine if this
        // has other columns like RPE, would need changes in the input modal too
        <div className="flex justify-around">
          <div>Reps</div>
          <div>Weight</div>
        </div>
      )}
      {exercise.sets.map(
        (set: Set, index3) =>
          // TODO: Need to add some color
          (set.reps || set.weight) && (
            <div key={index3} className="flex justify-around">
              <div>{set.reps}</div>
              <div>{set.weight}</div>
            </div>
          )
      )}
      {exercise.notes && (
        // TODO: Notes take up a lot of space so they should default to collapsed and be openable
        <p>Notes:</p>
      )}
      <p className="rounded-md bg-slate-300 p-2">{exercise.notes}</p>
    </div>
  );
}
