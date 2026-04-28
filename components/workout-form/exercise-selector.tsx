"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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
  openOnMount?: boolean;
  hideTriggerWhenOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ExerciseSelector({
  value,
  onChange,
  exercises,
  openOnMount = false,
  hideTriggerWhenOpen = false,
  onOpenChange,
}: ExerciseSelectorProps) {
  const [open, setOpen] = useState(openOnMount);
  const [searchValue, setSearchValue] = useState("");
  const directOpenSurfaceRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
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
    (exercise) => exercise.trim().toLocaleLowerCase() === normalizedSearchValue,
  );
  const shouldShowCreateOption =
    trimmedSearchValue.length > 0 && !hasExactExistingMatch;

  useEffect(() => {
    if (open) {
      const focusTimeout = window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);

      return () => window.clearTimeout(focusTimeout);
    }
  }, [open]);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      setSearchValue("");
    }

    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }, [onOpenChange]);

  function handleExerciseSelect(nextValue: string) {
    onChange(nextValue);
    handleOpenChange(false);
  }

  const shouldHideTrigger = hideTriggerWhenOpen && open;

  useEffect(() => {
    if (!shouldHideTrigger) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        !directOpenSurfaceRef.current?.contains(target)
      ) {
        handleOpenChange(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [handleOpenChange, shouldHideTrigger]);

  const commandSurface = (
    <Command shouldFilter={false}>
      <CommandInput
        ref={searchInputRef}
        autoFocus
        placeholder="Search or add exercise..."
        className="h-11 text-base"
        onInput={(e) => setSearchValue(e.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && hideTriggerWhenOpen) {
            handleOpenChange(false);
          }
        }}
      />
      <CommandList className="max-h-[min(calc(100vh-13rem),24rem)]">
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
  );

  if (shouldHideTrigger) {
    return (
      <div
        ref={directOpenSurfaceRef}
        className="bg-popover text-popover-foreground w-full overflow-hidden rounded-md border p-0 shadow-md"
      >
        {commandSurface}
      </div>
    );
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
            "border-border bg-input hover:bg-input/90 grid h-10 w-full flex-1 grid-cols-[minmax(0,1fr)_auto] text-base shadow-sm shadow-black/20 transition-colors sm:h-11",
            !value && "text-muted-foreground",
          )}
        >
          <span className="truncate text-left">{displayValue}</span>
          <ChevronsUpDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] max-w-md p-0 sm:w-[var(--radix-popover-trigger-width)]"
        align="start"
        side="bottom"
      >
        {commandSurface}
      </PopoverContent>
    </Popover>
  );
}
