"use client";
import { useEffect, useRef, useState } from "react";
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
  ExerciseTemplateValues,
  ExerciseTemplateValuesByName,
  WorkoutDraft,
  WorkoutFormProps,
  WorkoutFormSeed,
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
const getBrowserTodayDate = () => new Date().toLocaleDateString("en-CA");

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

type WorkoutFormSession = Omit<WorkoutFormSeed, "initialValues">;

type LocalCreatePromotion = {
  sourceSeedKey: string;
  workoutId: number;
};

function getWorkoutFormSeedKey({
  initialValues,
  formSession,
}: {
  initialValues: WorkoutDraft;
  formSession: WorkoutFormSession;
}): string {
  return JSON.stringify({
    initialValues,
    persistMode: formSession.persistMode,
    workoutId: formSession.workoutId,
    templateValuesByExerciseName: formSession.templateValuesByExerciseName,
  });
}

function getTemplateExerciseByName({
  exerciseName,
  templateValuesByExerciseName,
}: {
  exerciseName: string;
  templateValuesByExerciseName?: ExerciseTemplateValuesByName;
}): ExerciseTemplateValues | undefined {
  if (!exerciseName || !templateValuesByExerciseName) {
    return undefined;
  }

  if (!Object.hasOwn(templateValuesByExerciseName, exerciseName)) {
    return undefined;
  }

  return templateValuesByExerciseName[exerciseName];
}

export default function WorkoutForm(props: WorkoutFormProps) {
  const { initialValues, persistMode, templateValuesByExerciseName } = props;
  const workoutId = "workoutId" in props ? props.workoutId : undefined;
  const [failedSaveSeedKey, setFailedSaveSeedKey] = useState<string | null>(
    null,
  );
  const [localCreatePromotion, setLocalCreatePromotion] =
    useState<LocalCreatePromotion | null>(null);
  const [exercises, setExercises] = useState<string[]>([]);
  const incomingFormSession: WorkoutFormSession = {
    persistMode,
    workoutId,
    templateValuesByExerciseName,
  };
  const incomingSeedKey = getWorkoutFormSeedKey({
    initialValues,
    formSession: incomingFormSession,
  });
  const formSession: WorkoutFormSession =
    localCreatePromotion?.sourceSeedKey === incomingSeedKey
      ? {
          ...incomingFormSession,
          persistMode: "update",
          workoutId: localCreatePromotion.workoutId,
        }
      : incomingFormSession;
  const hasSaveFailed = failedSaveSeedKey === incomingSeedKey;
  const appliedSeedKeyRef = useRef(incomingSeedKey);
  const initializedDateSeedKeyRef = useRef<string | null>(null);
  const form = useForm<WorkoutDraft>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: initialValues,
  });
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
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
  const saveStatus = getSaveStatus({
    persistMode: formSession.persistMode,
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
    if (incomingSeedKey === appliedSeedKeyRef.current) {
      return;
    }

    appliedSeedKeyRef.current = incomingSeedKey;
    reset(initialValues);
  }, [incomingSeedKey, initialValues, reset]);

  useEffect(() => {
    if (formSession.persistMode !== "create") {
      return;
    }

    if (initializedDateSeedKeyRef.current === incomingSeedKey) {
      return;
    }

    if (getValues("date")) {
      initializedDateSeedKeyRef.current = incomingSeedKey;
      return;
    }

    initializedDateSeedKeyRef.current = incomingSeedKey;
    setValue("date", getBrowserTodayDate(), {
      shouldDirty: false,
      shouldTouch: false,
    });
  }, [formSession.persistMode, getValues, incomingSeedKey, setValue]);

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

        setFailedSaveSeedKey(null);
        unsubscribe();
      },
    });

    return () => {
      unsubscribe();
    };
  }, [hasSaveFailed, subscribe]);

  const onSubmit = async (values: WorkoutDraft) => {
    const submittedSnapshot = cloneWorkoutForm(values);
    setFailedSaveSeedKey(null);

    const result = await saveWorkout({
      persistMode: formSession.persistMode,
      workoutId: formSession.workoutId,
      values: submittedSnapshot,
    });

    if (!result.ok) {
      setFailedSaveSeedKey(incomingSeedKey);
      return;
    }

    setFailedSaveSeedKey(null);
    reset(submittedSnapshot);

    if (formSession.persistMode === "create") {
      setLocalCreatePromotion({
        sourceSeedKey: incomingSeedKey,
        workoutId: result.workoutId,
      });
      window.history.replaceState(
        window.history.state,
        "",
        `/workouts/edit/${result.workoutId}`,
      );
    }
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
            const templateExercise = getTemplateExerciseByName({
              exerciseName,
              templateValuesByExerciseName:
                formSession.templateValuesByExerciseName,
            });

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
                workoutId={formSession.workoutId}
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
