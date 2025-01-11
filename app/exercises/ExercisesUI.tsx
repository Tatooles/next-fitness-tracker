"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import ExerciseItem from "@/components/ExerciseItem";
import { DateExercise } from "@/lib/types";

export default function ExercisesUI({
  exercises,
}: {
  exercises: DateExercise[];
}) {
  // TODO: Rework this page so each exercise only shows once in the list
  // Expanding dropdown shows each time it was logged with the date
  const [inputValue, setInputValue] = useState("");
  const [initialList] = useState(exercises);
  const [filteredList, setFilteredList] = useState(exercises);

  const searchHandler = useCallback(() => {
    const filteredData = initialList.filter((exercise) => {
      return exercise.name.toLowerCase().includes(inputValue.toLowerCase());
    });
    setFilteredList(filteredData);
  }, [initialList, inputValue]);

  useEffect(() => {
    // Timeout so search doesn't fire on every key input
    const timer = setTimeout(() => {
      searchHandler();
    }, 500);

    // Cleanup timeout
    return () => {
      clearTimeout(timer);
    };
  }, [searchHandler]);

  return (
    <div className="p-5 text-center">
      <h1 className="mb-5 text-3xl">Exercises</h1>
      <Input
        type="search"
        placeholder="Search exercises"
        className="text-[16px]"
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      <Accordion type="single" collapsible className="mb-5">
        {filteredList.map((exercise) => (
          <AccordionItem key={exercise.id} value={`exercise-${exercise.id}`}>
            <AccordionTrigger>
              {/* TODO: Would like this text to cut off with ellipsis rather than wrap */}
              {exercise.date} - {exercise.name}
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
