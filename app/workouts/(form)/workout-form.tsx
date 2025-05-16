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
      // If creating or duplicating, just create new workout
      try {
        await addToDB(values);
      } catch (error) {
        setShowSpinner(false);
        window.alert("Workout save failed");
      }
    } else {
      // If editing, delete existing workout, then add new one
      try {
        await Promise.all([deleteWorkout(workoutId), addToDB(values)]);
        throw new Error();
      } catch (error) {
        setShowSpinner(false);
        window.alert("Workout save failed");
      }
    }
    setShowSpinner(false);
  };

  const addToDB = async (form: TWorkoutFormSchema) => {
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

  const deleteWorkout = async (id: number) => {
    await fetch(`/api/workouts/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Failed to delete exercise.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while deleting exercise:", error);
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
    <div className="mx-auto p-4 sm:max-w-md">
      <h2 className="text-center text-2xl">
        {workoutId !== -1 ? "Edit Workout" : "Create Workout"}
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col text-left"
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date:</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="mt-2 mb-4 text-[16px]"
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
                <FormLabel>Workout Name:</FormLabel>
                <FormControl>
                  <Input className="text-[16px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Label>Exercises</Label>
            {fields.map((field, index) => (
              <div
                className="flex flex-col gap-4 border-b-2 border-slate-700 px-2 py-4"
                key={field.id}
              >
                <div className="flex items-center">
                  <FormField
                    control={form.control}
                    name={`exercises.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
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
                                  "w-[270px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? field.value : "Select exercise"}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[270px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search exercise..."
                                className="h-9"
                                onInput={(e) =>
                                  setExerciseNameValue(e.currentTarget.value)
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
                                <CommandEmpty>No exercise found.</CommandEmpty>
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
                                    >
                                      {exercise}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                  <Trash2
                    onClick={() => {
                      remove(index);
                      setPopoverOpenStates((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                    size={28}
                    className="ml-5 text-red-600 cursor-pointer"
                  ></Trash2>
                </div>
                {exercises.includes(form.watch(`exercises.${index}.name`)) && (
                  <ExerciseHistoryModal
                    exerciseName={form.watch(`exercises.${index}.name`)}
                    // Filter out current workout if editing
                    filterOutWorkoutId={workoutId}
                  />
                )}
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
                          placeholder="Notes"
                          className="text-[16px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              variant="secondary"
              className="mt-4 w-full"
              type="button"
              onClick={() => {
                append({
                  name: "",
                  notes: "",
                  sets: [{ weight: "", reps: "", rpe: "" }],
                });
                setPopoverOpenStates((prev) => [...prev, false]);
              }}
            >
              Add Exercise
            </Button>
          </div>
          <Button type="submit" className="mt-4 self-center">
            Save
          </Button>
        </form>
      </Form>
      <Spinner show={showSpinner} />
    </div>
  );
}
