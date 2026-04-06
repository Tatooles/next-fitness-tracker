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
  PersistMode,
  WorkoutDraft,
  WorkoutFormProps,
} from "@/components/workout-form/form-types";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { saveWorkout } from "@/components/workout-form/save-workout";

const cloneWorkoutForm = (values: WorkoutDraft) => structuredClone(values);
const getTodayDate = () => new Date().toLocaleDateString("en-CA");

const normalizeWorkoutForm = (values: WorkoutDraft): WorkoutDraft => ({
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

export default function WorkoutForm({
  initialValues,
  persistMode,
  templateValuesByExerciseName,
  ...props
}: WorkoutFormProps) {
  const [hasSaveFailed, setHasSaveFailed] = useState(false);
  const [exercises, setExercises] = useState<string[]>([]);
  const router = useRouter();
  const normalizedWorkoutValue = useMemo(
    () => normalizeWorkoutForm(initialValues),
    [initialValues],
  );
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

        setHasSaveFailed(false);
        unsubscribe();
      },
    });

    return () => {
      unsubscribe();
    };
  }, [hasSaveFailed, subscribe]);

  const onSubmit = async (values: WorkoutDraft) => {
    const submittedSnapshot = cloneWorkoutForm(values);
    setHasSaveFailed(false);

    const result = await saveWorkout({
      persistMode,
      workoutId: updateWorkoutId,
      values: submittedSnapshot,
    });

    if (!result.ok) {
      setHasSaveFailed(true);
      return;
    }

    setHasSaveFailed(false);

    if (persistMode === "create") {
      router.push(`/workouts/edit/${result.workoutId}`);
      return;
    }

    reset(submittedSnapshot);
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting}>
      <WorkoutFormActionHeader saveStatus={saveStatus} />

      <FieldSet disabled={isSubmitting} className="mx-auto max-w-2xl p-4">
        <WorkoutFormHeader control={control} />

        <FieldSet>
          <FieldLegend>Exercises</FieldLegend>

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
