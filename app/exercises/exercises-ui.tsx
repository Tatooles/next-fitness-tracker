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
import ExerciseSummaryComponent from "@/app/exercises/exercise-summary";

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
    <>
      <Input
        type="search"
        placeholder="Search exercises"
        className="text-base mb-6"
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      <Accordion type="single" collapsible className="space-y-2">
        {filteredList.map((exerciseSummary) => (
          <AccordionItem
            key={exerciseSummary.name}
            value={`exercise-${exerciseSummary.name}`}
          >
            <AccordionTrigger>{exerciseSummary.name}</AccordionTrigger>
            <AccordionContent>
              <ExerciseSummaryComponent
                exerciseSummary={exerciseSummary}
                key={exerciseSummary.name}
              ></ExerciseSummaryComponent>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
