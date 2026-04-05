"use client";
import { useEffect, useMemo, useState } from "react";
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

const cloneWorkoutForm = (values: TWorkoutFormSchema) =>
  structuredClone(values);
const getTodayDate = () => new Date().toLocaleDateString("en-CA");

const normalizeWorkoutForm = (
  values: TWorkoutFormSchema,
): TWorkoutFormSchema => ({
  ...values,
  date: values.date || getTodayDate(),
});

const getSaveStatus = ({
  editMode,
  hasSaveFailed,
  isDirty,
  isSubmitting,
}: {
  editMode: boolean;
  hasSaveFailed: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}): WorkoutSaveStatus => {
  if (isSubmitting) {
    return "saving";
  }

  if (hasSaveFailed) {
    return "failed";
  }

  if (!editMode) {
    return "not_saved";
  }

  if (isDirty) {
    return "unsaved";
  }

  return "saved";
};

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
  const [failedWorkoutValueToken, setFailedWorkoutValueToken] =
    useState<TWorkoutFormSchema | null>(null);
  const [exercises, setExercises] = useState<string[]>([]);
  const router = useRouter();
  const normalizedWorkoutValue = useMemo(
    () => normalizeWorkoutForm(workoutValue),
    [workoutValue],
  );
  const workoutValueToken = normalizedWorkoutValue;
  const form = useForm<TWorkoutFormSchema>({
    resolver: zodResolver(workoutFormSchema),
    values: normalizedWorkoutValue,
  });
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    subscribe,
    formState: { isDirty, isSubmitting },
  } = form;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "exercises",
  });
  const watchedExercises = useWatch({
    control,
    name: "exercises",
  });
  const hasSaveFailed = failedWorkoutValueToken === workoutValueToken;
  const saveStatus = getSaveStatus({
    editMode,
    hasSaveFailed,
    isDirty,
    isSubmitting,
  });

  useEffect(() => {
    async function fetchExercises() {
      const response = await fetch("/api/exercises");
      const data: string[] = await response.json();
      setExercises(data);
    }
    fetchExercises();
  }, []);

  useEffect(() => {
    if (!hasSaveFailed) {
      return;
    }

    const unsubscribe = subscribe({
      formState: { values: true },
      callback: ({ name, type }) => {
        if (!name || type === "blur") {
          return;
        }

        setFailedWorkoutValueToken(null);
        unsubscribe();
      },
    });

    return () => {
      unsubscribe();
    };
  }, [hasSaveFailed, subscribe]);

  const onSubmit = async (values: TWorkoutFormSchema) => {
    const submittedSnapshot = cloneWorkoutForm(values);
    setFailedWorkoutValueToken(null);

    if (!editMode) {
      const newWorkoutId = await createWorkout(submittedSnapshot);
      if (newWorkoutId) {
        router.push(`/workouts/edit/${newWorkoutId}`);
      } else {
        setFailedWorkoutValueToken(workoutValueToken);
      }
    } else {
      const wasSaved = await updateWorkout(workoutId, submittedSnapshot);

      if (wasSaved) {
        setFailedWorkoutValueToken(null);
        reset(submittedSnapshot);
      } else {
        setFailedWorkoutValueToken(workoutValueToken);
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
        toast.error("Failed to save workout");
        return false;
      }

      return true;
    } catch (error) {
      console.error("An error occurred while updating exercise:", error);
      toast.error("Failed to save workout");
      return false;
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting}>
      <WorkoutFormActionHeader saveStatus={saveStatus} />

      <FieldSet disabled={isSubmitting} className="mx-auto max-w-2xl p-4">
        <WorkoutFormHeader control={control} />

        <FieldSet>
          <FieldLegend>Exercises</FieldLegend>

          {fields.map((field, index) => (
            <ExerciseItem
              key={field.id}
              index={index}
              control={control}
              getValues={getValues}
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
          >
            Add Exercise
          </Button>
        </FieldSet>

        <div className="rounded-lg border p-4">
          <Controller
            name="durationMinutes"
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                orientation="horizontal"
                className="justify-between"
              >
                <FieldLabel
                  htmlFor={field.name}
                  className="text-base font-semibold"
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
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? null
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
      </FieldSet>
    </form>
  );
}
