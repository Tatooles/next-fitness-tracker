"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FormSets from "@/app/workouts/(form)/form-sets";
import { LoadingOverlay } from "@/components/loading-overlay";
import {
  workoutFormSchema,
  TWorkoutFormSchema,
  ExerciseThin,
} from "@/lib/types";
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
import { toast, Toaster } from "sonner";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    if (!editMode) {
      await addWorkout(values);
      router.push("/workouts");
    } else {
      await updateWorkout(workoutId, values);
    }
    setIsLoading(false);
  };

  /**
   * Creates a new workout with the values from the form
   *
   * @param form the form values to create the workout with
   */
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
          toast.error("Failed to add workout");
        }
      })
      .catch((error) => {
        console.error("An error occurred while adding exercise:", error);
        toast.error("Failed to add workout");
      });
  };

  /**
   * Updates an existing workout with the values from the form
   *
   * @param id the id of the workout to update
   * @param form the form values to update the workout with
   */
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
          toast.error("Failed to save workout");
        } else {
          toast.success("Saved workout");
        }
      })
      .catch((error) => {
        console.error("An error occurred while updating exercise:", error);
        toast.error("Failed to save workout");
      });
  };

  const form = useForm<z.infer<typeof workoutFormSchema>>({
    resolver: zodResolver(workoutFormSchema),
    values: workoutValue,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  const watchedExercises = useWatch({
    control: form.control,
    name: "exercises",
  });

  // Set today's date if date is empty (for create mode)
  useEffect(() => {
    if (!workoutValue.date) {
      form.setValue("date", new Date().toLocaleDateString("en-CA"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-2 sm:px-6">
      <LoadingOverlay isLoading={isLoading} />
      <Toaster richColors position="top-center" />
      <div className="space-y-4 rounded-lg p-3 shadow-lg sm:space-y-6 sm:p-6">
        <h2 className="from-primary to-primary/60 mb-4 bg-linear-to-r bg-clip-text text-center text-2xl font-bold text-transparent sm:mb-8 sm:text-3xl">
          {workoutId !== -1 ? "Edit Workout" : "Create Workout"}
        </h2>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-base font-semibold"
                  >
                    Date
                  </FieldLabel>
                  <Input
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="date"
                    className="bg-background/50 hover:bg-background/80 h-10 w-full text-base transition-colors sm:h-11"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-base font-semibold"
                  >
                    Workout Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="bg-background/50 hover:bg-background/80 h-10 text-base transition-colors sm:h-11"
                    placeholder="Enter workout name"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <FieldSet className="space-y-3 sm:space-y-4">
            <FieldLegend className="text-base font-semibold sm:text-lg">
              Exercises
            </FieldLegend>

            {fields.map((field, index) => (
              <div
                className="relative rounded-lg border p-3 shadow-xs transition-all hover:shadow-md"
                key={field.id}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Controller
                      control={form.control}
                      name={`exercises.${index}.name`}
                      render={({ field, fieldState }) => (
                        <Field className="flex-1">
                          <div className="flex items-center gap-2">
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
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={popoverOpenStates[index]}
                                  className={cn(
                                    "bg-background/50 hover:bg-background/80 h-10 w-56 justify-between text-base transition-colors sm:h-11 sm:w-md",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  <span className="truncate">
                                    {field.value
                                      ? field.value
                                      : "Select exercise"}
                                  </span>
                                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-full p-0"
                                align="start"
                              >
                                <Command>
                                  <CommandInput
                                    placeholder="Search exercise..."
                                    className="h-11 text-base"
                                    onInput={(e) =>
                                      setExerciseNameValue(
                                        e.currentTarget.value,
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
                                          exerciseNameValue,
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
                                              exercise,
                                            );
                                            setPopoverOpenStates((prev) => {
                                              const newState = [...prev];
                                              newState[index] = false;
                                              return newState;
                                            });
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
                            {watchedExercises?.[index]?.name &&
                              exercises.includes(
                                watchedExercises[index].name,
                              ) && (
                                <ExerciseHistoryModal
                                  exerciseName={watchedExercises[index].name}
                                  filterOutWorkoutId={workoutId}
                                />
                              )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="hover:bg-destructive/10 hover:text-destructive shrink-0 transition-colors"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <FormSets
                    exerciseName={watchedExercises?.[index]?.name || ""}
                    exerciseIndex={index}
                    control={form.control}
                    getValues={form.getValues}
                    placeholderValues={placeholderValues}
                  />

                  <Controller
                    control={form.control}
                    name={`exercises.${index}.notes`}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Textarea
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Add notes"
                          className="bg-background/50 hover:bg-background/80 resize-none text-base transition-colors"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
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
              className="hover:bg-primary/10 w-full text-base"
            >
              Add Exercise
            </Button>
          </FieldSet>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 w-full text-base"
              disabled={isLoading}
            >
              {editMode ? "Save" : "Create Workout"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
