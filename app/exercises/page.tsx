import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Exercise } from "@/lib/types";
import { exercises, sets, workouts } from "@/db/schema";
import { Set } from "@/lib/types";

async function getExercises() {
  const userId = auth().userId;
  if (userId) {
    const data = await db.query.workouts.findMany({
      where: (workouts, { eq }) => eq(workouts.userId, userId),
      columns: {
        date: true,
      },
      with: {
        exercises: {
          with: {
            sets: {
              orderBy: (sets, { asc }) => [asc(sets.id)],
            },
          },
        },
      },
    });
    return data;
  } else {
    return [];
  }
}

export default async function ExercisesPage() {
  const workouts = await getExercises();
  workouts.sort((a, b) => b.date.getTime() - a.date.getTime());
  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Exercises</h1>
      <Accordion type="single" collapsible className="mb-5">
        {workouts.map((workout, index) => (
          <div key={index}>
            {workout.exercises.map((exercise) => (
              <ExerciseItem
                date={workout.date}
                exercise={exercise}
              ></ExerciseItem>
            ))}
          </div>
        ))}
      </Accordion>
    </div>
  );
}

function ExerciseItem({ date, exercise }: { date: Date; exercise: Exercise }) {
  console.log(date, exercise);
  return (
    <AccordionItem key={exercise.id} value={`exercise-${exercise.id}`}>
      <AccordionTrigger>
        {date.toLocaleDateString()} - {exercise.name}
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-2 text-left">
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
      </AccordionContent>
    </AccordionItem>
  );
}
