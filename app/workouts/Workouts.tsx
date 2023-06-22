import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Workout, Exercise, Set } from "@/lib/types";

export default function Workouts({
  workouts,
  editWorkout,
}: {
  workouts: Workout[];
  editWorkout: (index: number) => void;
}) {
  const getDate = (date: Date | null) => {
    if (date) {
      return new Date(date).toLocaleDateString();
    }
  };

  const deleteWorkout = (workout: Workout) => {
    console.log("Deleting workout", workout.name);
    // TODO: use db workout object or add id to the current workout object
    // Should probably try to use the db object
  };

  return (
    <Accordion type="single" collapsible className="mb-5">
      {workouts.map((workout: Workout, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{workout.name}</AccordionTrigger>
          <AccordionContent>
            {/* <AccordionContent onClick={() => editWorkout(index)}> */}
            {/* <h3 className="text-md p-2 text-left">{getDate(workout.date)}</h3> */}
            <div className="flex justify-between">
              <div className="p-2">{getDate(workout.date)}</div>
              <Button
                onClick={() => deleteWorkout(workout)}
                className="py-1 px-2"
                variant="destructive"
              >
                Delete
              </Button>
            </div>
            <div className="divide-y-2 px-2">
              {workout.exercises.map((exercise: Exercise, index2) => (
                <Exercise exercise={exercise} key={index2}></Exercise>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function Exercise({ exercise }: { exercise: Exercise }) {
  return (
    <div className="p-2 text-left">
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
          (set.reps || set.weight) && (
            <div key={index3} className="flex justify-around">
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
