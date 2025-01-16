"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { DateExercise, ExerciseSummary } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import ExerciseSummaryItem from "@/components/ExerciseSummaryItem";

export default function ExercisesUI({
  exerciseSummaries,
}: {
  exerciseSummaries: ExerciseSummary[];
}) {
  // TODO: Rework this page so each exercise only shows once in the list
  // Expanding dropdown shows each time it was logged with the date
  const [inputValue, setInputValue] = useState("");
  const [initialList] = useState(exerciseSummaries);
  const [filteredList, setFilteredList] = useState(exerciseSummaries);

  const searchHandler = useCallback(() => {
    const filteredData = initialList.filter((exerciseSummary) => {
      return exerciseSummary.name
        .toLowerCase()
        .includes(inputValue.toLowerCase());
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
        {filteredList.map((exerciseSummary) => (
          <AccordionItem
            key={exerciseSummary.name}
            value={`exercise-${exerciseSummary.name}`}
          >
            <AccordionTrigger>
              {/* TODO: Would like this text to cut off with ellipsis rather than wrap */}
              {exerciseSummary.name}
            </AccordionTrigger>
            <AccordionContent>
              {exerciseSummary.exercises.map((exercise) => (
                <ExerciseSummaryItem
                  exercise={exercise}
                  key={exercise.id}
                ></ExerciseSummaryItem>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
