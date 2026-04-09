"use client";
import { useEffect, useMemo, useRef, useState } from "react";
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
  SaveState,
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
const getTodayDate = () => new Date().toLocaleDateString("en-CA");

const normalizeWorkoutForm = (values: WorkoutDraft): WorkoutDraft => ({
  ...values,
  date: values.date || getTodayDate(),
});

const getSaveStatus = ({
  persistMode,
  isDirty,
  saveState,
}: {
  persistMode: PersistMode;
  isDirty: boolean;
  saveState: SaveState;
}): WorkoutSaveStatus => {
  if (saveState === "saving") {
    return "saving";
  }

  if (saveState === "failed") {
    return "failed";
  }

  if (isDirty && persistMode === "update") {
    return "unsaved";
  }

  if (saveState === "saved") {
    return "saved";
  }

  if (persistMode === "create") {
    return "not_saved";
  }

  return "saved";
};

type WorkoutFormSession = Omit<WorkoutFormSeed, "initialValues">;

type LocalCreatePromotion = {
  sourceSeedKey: string;
  workoutId: number;
};

type SaveStateSnapshot = {
  seedKey: string;
  value: SaveState;
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

export default function WorkoutForm(props: WorkoutFormProps) {
  const { initialValues, persistMode, templateValuesByExerciseName } = props;
  const workoutId = "workoutId" in props ? props.workoutId : undefined;
  const [localCreatePromotion, setLocalCreatePromotion] =
    useState<LocalCreatePromotion | null>(null);
  const [exercises, setExercises] = useState<string[]>([]);
  const normalizedInitialValues = useMemo(
    () => normalizeWorkoutForm(initialValues),
    [initialValues],
  );
  const incomingFormSession: WorkoutFormSession = {
    persistMode,
    workoutId,
    templateValuesByExerciseName,
  };
  const incomingSeedKey = getWorkoutFormSeedKey({
    initialValues: normalizedInitialValues,
    formSession: incomingFormSession,
  });
  const [saveStateSnapshot, setSaveStateSnapshot] =
    useState<SaveStateSnapshot>({
      seedKey: incomingSeedKey,
      value: "idle",
    });
  const formSession: WorkoutFormSession =
    localCreatePromotion?.sourceSeedKey === incomingSeedKey
      ? {
          ...incomingFormSession,
          persistMode: "update",
          workoutId: localCreatePromotion.workoutId,
        }
      : incomingFormSession;
  const appliedSeedKeyRef = useRef(incomingSeedKey);
  const form = useForm<WorkoutDraft>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: normalizedInitialValues,
  });
  const {
    control,
    getValues,
    handleSubmit,
    reset,
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
  const effectiveSaveState =
    saveStateSnapshot.seedKey === incomingSeedKey
      ? saveStateSnapshot.value
      : "idle";
  const saveStatus = getSaveStatus({
    persistMode: formSession.persistMode,
    isDirty,
    saveState: effectiveSaveState,
  });

  const clearFailedSaveState = () => {
    if (
      saveStateSnapshot.seedKey === incomingSeedKey &&
      saveStateSnapshot.value === "failed"
    ) {
      setSaveStateSnapshot({
        seedKey: incomingSeedKey,
        value: "idle",
      });
    }
  };

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
    reset(normalizedInitialValues);
  }, [incomingSeedKey, normalizedInitialValues, reset]);

  const onSubmit = async (values: WorkoutDraft) => {
    const submittedSnapshot = cloneWorkoutForm(values);
    setSaveStateSnapshot({
      seedKey: incomingSeedKey,
      value: "saving",
    });

    const result = await saveWorkout({
      persistMode: formSession.persistMode,
      workoutId: formSession.workoutId,
      values: submittedSnapshot,
    });

    if (!result.ok) {
      setSaveStateSnapshot({
        seedKey: incomingSeedKey,
        value: "failed",
      });
      return;
    }

    reset(submittedSnapshot);
    setSaveStateSnapshot({
      seedKey: incomingSeedKey,
      value: "saved",
    });

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
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      onInputCapture={clearFailedSaveState}
      onChangeCapture={clearFailedSaveState}
      aria-busy={isSubmitting}
    >
      <WorkoutFormActionHeader saveStatus={saveStatus} />

      <FieldSet disabled={isSubmitting} className="mx-auto max-w-2xl p-4">
        <WorkoutFormHeader control={control} />

        <FieldSet>
          <FieldLegend>Exercises</FieldLegend>

          {fields.map((field, index) => {
            const exerciseName = watchedExercises?.[index]?.name || "";
            const templateExercise = exerciseName
              ? formSession.templateValuesByExerciseName?.[exerciseName]
              : undefined;

            return (
              <ExerciseItem
                key={field.id}
                index={index}
                control={control}
                getValues={getValues}
                exercises={exercises}
                exerciseName={exerciseName}
                clearFailedSaveState={clearFailedSaveState}
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
            onClick={() => {
              clearFailedSaveState();
              append({
                name: "",
                notes: "",
                sets: [{ weight: "", reps: "", rpe: "" }],
              });
            }}
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
