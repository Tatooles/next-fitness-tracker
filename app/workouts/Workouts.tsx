import { Workout, Exercise, Set } from "./page";

export default function Workouts({ workouts }: { workouts: Workout[] }) {
  const getDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <ul>
      {workouts.map((workout: Workout, index) => (
        // TODO: Break exercise into it's own component inside this file
        <li key={index} className="mb-2 border-2 border-black p-2">
          {/* TODO: This will be accordion with only the name and date showing when closed */}
          <h2 className="text-left text-xl">{workout.name}</h2>
          <h3 className="text-md mb-4 text-left">{getDate(workout.date)}</h3>
          {workout.exercises.map((exercise: Exercise, index2) => (
            <div
              className="mb-2 border-2 border-black p-2 text-left"
              key={index2}
            >
              <h3 className="self-center text-center text-lg font-bold">
                {exercise.name}
              </h3>
              {exercise.sets.map(
                (set: Set, index3) =>
                  // TODO: Need to add some color
                  // TODO: Make this into more of a grid with weight and reps at the top
                  (set.reps || set.weight) && (
                    <div key={index3} className="flex justify-around">
                      <div>Reps: {set.reps}</div>
                      <div>Weight: {set.weight}</div>
                    </div>
                  )
              )}
              {exercise.notes && <p>Notes:</p>}
              <p className=" bg-gray-400">{exercise.notes}</p>
            </div>
          ))}
        </li>
      ))}
    </ul>
  );
}
