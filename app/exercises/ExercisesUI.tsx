"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { ExerciseSummary } from "@/lib/types";
import ExerciseSummaryComponent from "@/app/exercises/ExerciseSummary";

export default function ExercisesUI({
  exerciseSummaries,
}: {
  exerciseSummaries: ExerciseSummary[];
}) {
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
            <AccordionTrigger className="w-full">
              <span className="mr-4 truncate">{exerciseSummary.name}</span>
            </AccordionTrigger>
            <AccordionContent>
              <ExerciseSummaryComponent
                exerciseSummary={exerciseSummary}
                key={exerciseSummary.name}
              ></ExerciseSummaryComponent>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
