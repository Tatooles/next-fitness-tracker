"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseSelectorProps {
  value: string;
  onChange: (value: string) => void;
  exercises: string[];
}

export default function ExerciseSelector({
  value,
  onChange,
  exercises,
}: ExerciseSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const displayValue = value || "Select exercise";
  const trimmedSearchValue = searchValue.trim();
  const normalizedSearchValue = trimmedSearchValue.toLocaleLowerCase();
  const filteredExercises =
    normalizedSearchValue === ""
      ? exercises
      : exercises.filter((exercise) =>
          exercise.toLocaleLowerCase().includes(normalizedSearchValue),
        );
  const hasExactExistingMatch = exercises.some(
    (exercise) =>
      exercise.trim().toLocaleLowerCase() === normalizedSearchValue,
  );
  const shouldShowCreateOption =
    trimmedSearchValue.length > 0 && !hasExactExistingMatch;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearchValue("");
    }
  }

  function handleExerciseSelect(nextValue: string) {
    onChange(nextValue);
    setSearchValue("");
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          title={displayValue}
          className={cn(
            "bg-background/50 hover:bg-background/80 grid h-10 w-full flex-1 grid-cols-[minmax(0,1fr)_auto] text-base transition-colors sm:h-11",
            !value && "text-muted-foreground",
          )}
        >
          <span className="truncate text-left">{displayValue}</span>
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search or add exercise..."
            className="h-11 text-base"
            onInput={(e) => setSearchValue(e.currentTarget.value)}
          />
          <CommandList>
            <CommandEmpty>No matching exercises.</CommandEmpty>
            <CommandGroup>
              {filteredExercises.map((exercise) => (
                <CommandItem
                  value={exercise}
                  key={exercise}
                  onSelect={() => handleExerciseSelect(exercise)}
                  className="hover:bg-primary/10 cursor-pointer text-base transition-colors"
                >
                  {exercise}
                </CommandItem>
              ))}
              {shouldShowCreateOption && (
                <CommandItem
                  value={trimmedSearchValue}
                  onSelect={() => handleExerciseSelect(trimmedSearchValue)}
                  className="hover:bg-primary/10 cursor-pointer text-base transition-colors"
                >
                  Add &quot;{trimmedSearchValue}&quot;
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
