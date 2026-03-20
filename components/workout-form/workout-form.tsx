"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import ExerciseItem from "@/components/workout-form/exercise-item";
import WorkoutFormHeader from "@/components/workout-form/workout-form-header";
import WorkoutFormActionHeader, {
  WorkoutSaveStatus,
} from "@/components/workout-form/workout-form-action-header";
import {
  workoutFormSchema,
  TWorkoutFormSchema,
  ExerciseThin,
} from "@/lib/types";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
interface WorkoutFormProps {
  editMode: boolean;
  workoutValue: TWorkoutFormSchema;
  workoutId: number;
  placeholderValues?: ExerciseThin[];
}

export default function WorkoutForm({
  editMode,
  workoutValue,
  workoutId,
  placeholderValues,
}: WorkoutFormProps) {
  const [hasSavedOnce, setHasSavedOnce] = useState(editMode);
  const [saveStatus, setSaveStatus] = useState<WorkoutSaveStatus>(
    editMode ? "saved" : "not_saved",
  );
  const [exercises, setExercises] = useState<string[]>([]);
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
    setSaveStatus("saving");

    if (!editMode) {
      const newWorkoutId = await createWorkout(values);
      if (newWorkoutId) {
        router.push(`/workouts/edit/${newWorkoutId}`);
      } else {
        setSaveStatus("failed");
      }
    } else {
      const wasSaved = await updateWorkout(workoutId, values);

      if (wasSaved) {
        form.reset(values);
        setHasSavedOnce(true);
        setSaveStatus("saved");
      } else {
        setSaveStatus("failed");
      }
    }
  };

  /**
   * Creates a new workout with the values from the form
   *
   * @param form the form values to create the workout with
   * @returns the ID of the newly created workout, or null if creation failed
   */
  const createWorkout = async (
    form: TWorkoutFormSchema,
  ): Promise<number | null> => {
    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error("Failed to create workout");
        return null;
      }

      const data = await response.json();
      return data.workoutId;
    } catch (error) {
      console.error("An error occurred while creating workout:", error);
      toast.error("Failed to create workout");
      return null;
    }
  };

  /**
   * Updates an existing workout with the values from the form
   *
   * @param id the id of the workout to update
   * @param form the form values to update the workout with
   */
  const updateWorkout = async (
    id: number,
    form: TWorkoutFormSchema,
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("An error occurred while updating exercise:", error);
      return false;
    }
  };

  const form = useForm<TWorkoutFormSchema>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: workoutValue,
  });

  const { isDirty } = form.formState;

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  const watchedExercises = useWatch({
    control: form.control,
    name: "exercises",
  });
  const watchedFormValues = useWatch({
    control: form.control,
  });

  // Set today's date if date is empty (for create mode)
  useEffect(() => {
    if (!workoutValue.date) {
      form.setValue("date", new Date().toLocaleDateString("en-CA"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSaveStatus((currentStatus) => {
      if (currentStatus === "saving") {
        return currentStatus;
      }

      if (currentStatus === "failed") {
        return "unsaved";
      }

      if (isDirty) {
        return "unsaved";
      }

      if (editMode || hasSavedOnce) {
        return "saved";
      }

      return "not_saved";
    });
  }, [editMode, hasSavedOnce, isDirty, watchedFormValues]);

  return (
    <div className="mx-auto max-w-2xl px-2 sm:px-6">
      <div className="space-y-4 rounded-lg p-3 shadow-lg sm:space-y-6 sm:p-6">
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <WorkoutFormActionHeader saveStatus={saveStatus} />

          <WorkoutFormHeader control={form.control} />

          <FieldSet className="space-y-3 sm:space-y-4">
            <FieldLegend className="text-base font-semibold sm:text-lg">
              Exercises
            </FieldLegend>

            {fields.map((field, index) => (
              <ExerciseItem
                key={field.id}
                index={index}
                control={form.control}
                getValues={form.getValues}
                exercises={exercises}
                exerciseName={watchedExercises?.[index]?.name || ""}
                onRemove={() => remove(index)}
                onMoveUp={() => move(index, index - 1)}
                onMoveDown={() => move(index, index + 1)}
                isFirst={index === 0}
                isLast={index === fields.length - 1}
                workoutId={workoutId}
                placeholderValues={placeholderValues}
              />
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

          <div className="border-border/60 bg-background/20 rounded-lg border p-4 sm:p-5">
            <Controller
              name="durationMinutes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  orientation="horizontal"
                  className="justify-between"
                >
                  <FieldLabel
                    htmlFor={field.name}
                    className="min-w-0 text-base leading-tight font-semibold sm:text-lg"
                  >
                    Workout Duration
                  </FieldLabel>
                  <div className="w-32 shrink-0 sm:w-36">
                    <div className="relative">
                      <Input
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        type="number"
                        min="1"
                        step="1"
                        inputMode="numeric"
                        className="bg-background/50 hover:bg-background/80 h-11 w-full pr-12 text-center text-lg tabular-nums transition-colors"
                        placeholder="45"
                        value={field.value ?? ""}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === ""
                              ? undefined
                              : Number(event.target.value),
                          )
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium">
                        min
                      </span>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
