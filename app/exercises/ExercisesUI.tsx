"use client";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ExerciseItem from "@/components/ExerciseItem";
import { DateExercise } from "@/lib/types";

export default function ExercisesUI({
  exercises,
}: {
  exercises: DateExercise[];
}) {
  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Exercises</h1>
      <Accordion type="single" collapsible className="mb-5">
        {exercises.map((exercise) => (
          <AccordionItem key={exercise.id} value={`exercise-${exercise.id}`}>
            <AccordionTrigger>
              {/* TODO: Would like this text to cut off with ellipsis rather than wrap */}
              {exercise.date.toLocaleDateString()} - {exercise.name}
            </AccordionTrigger>
            <AccordionContent>
              <ExerciseItem exercise={exercise}></ExerciseItem>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
