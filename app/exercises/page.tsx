import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ExerciseItem from "@/components/ExerciseItem";
import { Exercise } from "@/lib/types";

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
              <AccordionItem
                key={exercise.id}
                value={`exercise-${exercise.id}`}
              >
                <AccordionTrigger>
                  {/* TODO: Would like this text to cut off with ellipsis rather than wrap */}
                  {workout.date.toLocaleDateString()} - {exercise.name}
                </AccordionTrigger>
                <AccordionContent>
                  <ExerciseItem exercise={exercise}></ExerciseItem>
                </AccordionContent>
              </AccordionItem>
            ))}
          </div>
        ))}
      </Accordion>
    </div>
  );
}
