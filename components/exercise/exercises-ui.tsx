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
import ExerciseSummaryComponent from "@/components/exercise/exercise-summary";

export default function ExercisesUI({
  exerciseSummaries,
}: {
  exerciseSummaries: ExerciseSummary[];
}) {
  const [inputValue, setInputValue] = useState("");
  const [initialList] = useState(exerciseSummaries);
  const [filteredList, setFilteredList] = useState(exerciseSummaries);

  const formatDate = (date: Date): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - compareDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getLastPerformedDate = (exerciseSummary: ExerciseSummary): string => {
    let mostRecent: Date | null = null;

    exerciseSummary.exercises.forEach((exercise) => {
      if (exercise.date) {
        const exerciseDate = new Date(`${exercise.date}T00:00:00`);
        if (!mostRecent || exerciseDate > mostRecent) {
          mostRecent = exerciseDate;
        }
      }
    });

    if (!mostRecent) return "Never";
    return formatDate(mostRecent);
  };

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
        className="mb-6 text-base"
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
            <AccordionTrigger>
              <div className="flex w-full items-center justify-between pr-3">
                <span>{exerciseSummary.name}</span>
                <span className="text-muted-foreground text-xs font-normal">
                  {getLastPerformedDate(exerciseSummary)}
                </span>
              </div>
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
    </>
  );
}
