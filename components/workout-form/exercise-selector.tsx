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

  return (
    <div className="flex-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "bg-background/50 hover:bg-background/80 h-10 w-full justify-between text-base transition-colors sm:h-11",
              !value && "text-muted-foreground",
            )}
          >
            <span className="truncate">
              {value ? value : "Select exercise"}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search exercise..."
              className="h-11 text-base"
              onInput={(e) => setSearchValue(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchValue.trim() !== "") {
                  e.preventDefault();
                  onChange(searchValue);
                  setOpen(false);
                }
              }}
            />
            <CommandList>
              <CommandEmpty>No exercise found.</CommandEmpty>
              <CommandGroup>
                {exercises.map((exercise) => (
                  <CommandItem
                    value={exercise}
                    key={exercise}
                    onSelect={() => {
                      onChange(exercise);
                      setOpen(false);
                    }}
                    className="hover:bg-primary/10 cursor-pointer text-base transition-colors"
                  >
                    {exercise}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
