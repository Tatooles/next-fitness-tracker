"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FormSets from "@/app/workouts/(form)/form-sets";
import Spinner from "@/components/spinner";
import {
  workoutFormSchema,
  TWorkoutFormSchema,
  ExerciseThin,
} from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { ChevronsUpDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ExerciseHistoryModal from "@/components/exercise-history-modal";

export default function WorkoutForm({
  editMode,
  workoutValue,
  workoutId,
  placeholderValues,
}: {
  editMode: boolean;
  workoutValue: TWorkoutFormSchema;
  workoutId: number;
  placeholderValues?: ExerciseThin[];
}) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [exercises, setExercises] = useState<string[]>([]);
  const [popoverOpenStates, setPopoverOpenStates] = useState<boolean[]>([]);

  const [exerciseNameValue, setExerciseNameValue] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchExercises() {
      const response = await fetch("/api/exercises");
      const data: string[] = await response.json();
      setExercises(data);
    }
    fetchExercises();
  }, []);

  const onSubmit = async (values: TWorkoutFormSchema) => {
    setShowSpinner(true);
    if (!editMode) {
      await addWorkout(values);
      router.push("/workouts");
    } else {
      await updateWorkout(workoutId, values);
      setShowSpinner(false);
    }
  };

  const addWorkout = async (form: TWorkoutFormSchema) => {
    await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Failed to add exercise.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while adding exercise:", error);
      });
  };

  const updateWorkout = async (id: number, form: TWorkoutFormSchema) => {
    await fetch(`/api/workouts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Failed to update exercise.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while updating exercise:", error);
      });
  };

  // Likely need to remove workoutValues here, and code each placeholder value to be a value || placeholder text
  // May still need a workoutValue though, just with empty values so we get the correct workouts and set counts
  // Then update the placeholder since the value will be empty, therefore showing the placeholder
  const form = useForm<TWorkoutFormSchema>({
    resolver: zodResolver(workoutFormSchema),
    values: workoutValue,
  });

  const { fields, append, remove } = useFieldArray({
    name: "exercises",
    control: form.control,
  });

  return (
    <div className="mx-auto px-2 sm:px-6 max-w-2xl">
      {showSpinner && <Spinner show={true} />}
      <div className="bg-card rounded-lg shadow-lg p-3 sm:p-6 space-y-4 sm:space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {workoutId !== -1 ? "Edit Workout" : "Create Workout"}
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-semibold">
                      Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-10 sm:h-11 text-sm sm:text-base bg-background/50 hover:bg-background/80 transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-semibold">
                      Workout Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 sm:h-11 text-sm sm:text-base bg-background/50 hover:bg-background/80 transition-colors"
                        placeholder="Enter workout name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <Label className="text-base sm:text-lg font-semibold">
                Exercises
              </Label>

              {fields.map((field, index) => (
                <div
                  className="relative rounded-lg border bg-card p-3 sm:p-4 shadow-sm transition-all hover:shadow-md"
                  key={field.id}
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`exercises.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Popover
                              open={popoverOpenStates[index]}
                              onOpenChange={(isOpen) => {
                                setPopoverOpenStates((prev) => {
                                  const newState = [...prev];
                                  newState[index] = isOpen;
                                  return newState;
                                });
                              }}
                            >
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={popoverOpenStates[index]}
                                    className={cn(
                                      "w-full justify-between h-10 sm:h-11 text-sm sm:text-base bg-background/50 hover:bg-background/80 transition-colors",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? field.value
                                      : "Select exercise"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-full p-0"
                                align="start"
                              >
                                <Command>
                                  <CommandInput
                                    placeholder="Search exercise..."
                                    className="h-10 sm:h-11 text-sm sm:text-base"
                                    onInput={(e) =>
                                      setExerciseNameValue(
                                        e.currentTarget.value
                                      )
                                    }
                                    onKeyDown={(e) => {
                                      if (
                                        e.key === "Enter" &&
                                        exerciseNameValue.trim() !== ""
                                      ) {
                                        e.preventDefault();
                                        form.setValue(
                                          `exercises.${index}.name`,
                                          exerciseNameValue
                                        );
                                        setPopoverOpenStates((prev) => {
                                          const newState = [...prev];
                                          newState[index] = false;
                                          return newState;
                                        });
                                      }
                                    }}
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      No exercise found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {exercises.map((exercise) => (
                                        <CommandItem
                                          value={exercise}
                                          key={exercise}
                                          onSelect={() => {
                                            form.setValue(
                                              `exercises.${index}.name`,
                                              exercise
                                            );
                                            setPopoverOpenStates((prev) => {
                                              const newState = [...prev];
                                              newState[index] = false;
                                              return newState;
                                            });
                                          }}
                                          className="cursor-pointer hover:bg-primary/10 transition-colors text-sm sm:text-base"
                                        >
                                          {exercise}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <FormSets
                      exerciseName={form.watch(`exercises.${index}.name`)}
                      exerciseIndex={index}
                      control={form.control}
                      getValues={form.getValues}
                      placeholderValues={placeholderValues}
                    />

                    <FormField
                      control={form.control}
                      name={`exercises.${index}.notes`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Add notes"
                              className="resize-none text-sm sm:text-base bg-background/50 hover:bg-background/80 transition-colors"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    name: "",
                    notes: "",
                    sets: [{ weight: "", reps: "", rpe: "" }],
                  })
                }
                className="w-full text-sm sm:text-base hover:bg-primary/10 transition-colors"
              >
                Add Exercise
              </Button>
            </div>

            <div className="flex justify-end pt-2 sm:pt-4">
              <Button
                type="submit"
                className="w-full md:w-auto bg-primary hover:bg-primary/90 transition-colors text-sm sm:text-base"
                disabled={showSpinner}
              >
                {editMode ? "Save" : "Create Workout"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
