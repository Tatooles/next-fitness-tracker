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
import { workoutFormSchema } from "@/lib/types";
import type {
  ExerciseTemplateValues,
  PersistMode,
  WorkoutDraft,
} from "@/components/workout-form/form-model";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const cloneWorkoutForm = (values: WorkoutDraft) => structuredClone(values);
const getTodayDate = () => new Date().toLocaleDateString("en-CA");

const normalizeWorkoutForm = (
  values: WorkoutDraft,
): WorkoutDraft => ({
  ...values,
  date: values.date || getTodayDate(),
});

const getSaveStatus = ({
  persistMode,
  hasSaveFailed,
  isDirty,
  isSubmitting,
}: {
  persistMode: PersistMode;
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

  if (persistMode === "create") {
    return "not_saved";
  }

  if (isDirty) {
    return "unsaved";
  }

  return "saved";
};

type CreateWorkoutFormProps = {
  initialValues: WorkoutDraft;
  persistMode: "create";
  templateValuesByExerciseName?: Record<string, ExerciseTemplateValues>;
};

type UpdateWorkoutFormProps = {
  initialValues: WorkoutDraft;
  persistMode: "update";
  workoutId: number;
  templateValuesByExerciseName?: Record<string, ExerciseTemplateValues>;
};

type WorkoutFormProps = CreateWorkoutFormProps | UpdateWorkoutFormProps;

export default function WorkoutForm({
  initialValues,
  persistMode,
  templateValuesByExerciseName,
  ...props
}: WorkoutFormProps) {
  const [failedWorkoutValueToken, setFailedWorkoutValueToken] = useState<
    WorkoutDraft | null
  >(null);
  const [exercises, setExercises] = useState<string[]>([]);
  const router = useRouter();
  const normalizedWorkoutValue = useMemo(
    () => normalizeWorkoutForm(initialValues),
    [initialValues],
  );
  const workoutValueToken = normalizedWorkoutValue;
  const form = useForm<WorkoutDraft>({
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
  const updateWorkoutId = "workoutId" in props ? props.workoutId : undefined;
  const saveStatus = getSaveStatus({
    persistMode,
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

  const onSubmit = async (values: WorkoutDraft) => {
    const submittedSnapshot = cloneWorkoutForm(values);
    setFailedWorkoutValueToken(null);

    if (persistMode === "create") {
      const newWorkoutId = await createWorkout(submittedSnapshot);
      if (newWorkoutId) {
        router.push(`/workouts/edit/${newWorkoutId}`);
      } else {
        setFailedWorkoutValueToken(workoutValueToken);
      }
    } else {
      if (!("workoutId" in props) || props.workoutId == null) {
        throw new Error("WorkoutForm requires workoutId in update mode");
      }

      const wasSaved = await updateWorkout(props.workoutId, submittedSnapshot);

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
    form: WorkoutDraft,
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
    form: WorkoutDraft,
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
    <div className="mx-auto max-w-2xl overflow-x-clip px-2 sm:px-6">
      <div className="space-y-4 rounded-lg p-3 shadow-lg sm:space-y-6 sm:p-6">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
          aria-busy={isSubmitting}
        >
          <FieldSet
            disabled={isSubmitting}
            className="space-y-4 border-0 p-0 sm:space-y-6"
          >
            <WorkoutFormActionHeader saveStatus={saveStatus} />

            <WorkoutFormHeader control={control} />

            <FieldSet className="space-y-3 sm:space-y-4">
              <FieldLegend className="text-base font-semibold sm:text-lg">
                Exercises
              </FieldLegend>

              {fields.map((field, index) => {
                const exerciseName = watchedExercises?.[index]?.name || "";
                const templateExercise = exerciseName
                  ? templateValuesByExerciseName?.[exerciseName]
                  : undefined;

                return (
                  <ExerciseItem
                    key={field.id}
                    index={index}
                    control={control}
                    getValues={getValues}
                    exercises={exercises}
                    exerciseName={exerciseName}
                    onRemove={() => remove(index)}
                    onMoveUp={() => move(index, index - 1)}
                    onMoveDown={() => move(index, index + 1)}
                    isFirst={index === 0}
                    isLast={index === fields.length - 1}
                    workoutId={
                      persistMode === "update" ? updateWorkoutId : undefined
                    }
                    templateExercise={templateExercise}
                  />
                );
              })}

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
                control={control}
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
      </div>
    </div>
  );
}
