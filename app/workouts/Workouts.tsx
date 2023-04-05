import { Workout, Exercise, Set } from "./page";

export default function Workouts({ workouts }: { workouts: Workout[] }) {
  const getDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <ul>
      {workouts.map((workout: Workout, index) => (
        // TODO: Display exercises and sets for each workout, will need nested loops
        // TODO: Break exercise into it's own component inside this file
        <li key={index} className="mb-2 border-2 border-black">
          <h3 className="text-xl">{getDate(workout.date)}</h3>
          <p>{workout.name}</p>
          {workout.exercises.map((exercise: Exercise, index) => (
            <div key={index}>
              <h3>{exercise.name}</h3>
              <div>Sets will go here</div>
              <p>Notes: {exercise.notes}</p>
            </div>
          ))}
        </li>
      ))}
    </ul>
  );
}
