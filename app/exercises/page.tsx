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

async function getExercises() {
  const userId = auth().userId;
  if (userId) {
    //   const data: Exercise[] = await db.query.exercises.findMany();
    //   return data;
    const data = await db.query.workouts.findMany({
      where: (workouts, { eq }) => eq(workouts.userId, userId),
      columns: {
        date: true,
      },
      with: {
        exercises: {
          with: {
            sets: true,
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
      <AccordionTrigger>{exercise.name}</AccordionTrigger>
      <AccordionContent>
        <div className="p-2 text-left">
          <h3 className="text-lg font-bold">{date.toLocaleDateString()}</h3>
          {exercise.sets.map((set) => {
            <div key={set.id} className="flex">
              <div>{set.reps}</div>
              <div>{set.weight}</div>
            </div>;
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
