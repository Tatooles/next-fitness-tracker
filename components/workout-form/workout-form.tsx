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
import {
  groupExercisesForDisplay,
  joinSupersetWithPrevious,
  moveExerciseBlock,
  removeExerciseAtIndex,
  removeExerciseFromSuperset,
  startSupersetWithNext,
} from "@/lib/superset-utils";

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
    exerciseNames: formSession.exerciseNames,
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
  const {
    initialValues,
    persistMode,
    templateValuesByExerciseName,
    exerciseNames,
  } = props;
  const workoutId = "workoutId" in props ? props.workoutId : undefined;
  const [failedSaveSeedKey, setFailedSaveSeedKey] = useState<string | null>(
    null,
  );
  const [localCreatePromotion, setLocalCreatePromotion] =
    useState<LocalCreatePromotion | null>(null);
  const incomingFormSession: WorkoutFormSession = {
    persistMode,
    exerciseNames,
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
  const { fields, append, replace } = useFieldArray({
    control,
    name: "exercises",
  });
  const watchedExercises = useWatch({
    control,
    name: "exercises",
  });
  const currentExercises = watchedExercises ?? getValues("exercises");
  const renderExercises = fields.map((field, index) => ({
    id: field.id,
    name: currentExercises[index]?.name ?? "",
    supersetGroupId: currentExercises[index]?.supersetGroupId ?? null,
  }));
  const exerciseBlocks = groupExercisesForDisplay(renderExercises);
  const saveStatus = getSaveStatus({
    persistMode: formSession.persistMode,
    hasSaveFailed,
    isDirty,
    isSubmitting,
  });

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

  const replaceExercises = (exercises: WorkoutDraft["exercises"]) => {
    replace(exercises);
  };

  const createSupersetGroupId = () => globalThis.crypto.randomUUID();

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} aria-busy={isSubmitting}>
      <WorkoutFormActionHeader saveStatus={saveStatus} />

      <FieldSet
        disabled={isSubmitting}
        className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6"
      >
        <WorkoutFormHeader control={control} />

        <FieldSet className="gap-4">
          <FieldLegend className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
            Exercises
          </FieldLegend>

          {exerciseBlocks.map((block) => {
            const blockContent = block.exercises.map((_, offset) => {
              const index = block.startIndex + offset;
              const field = fields[index];
              const exerciseName = renderExercises[index]?.name ?? "";
              const exerciseGroupId =
                renderExercises[index]?.supersetGroupId ?? null;
              const templateExercise = getTemplateExerciseByName({
                exerciseName,
                templateValuesByExerciseName:
                  formSession.templateValuesByExerciseName,
              });

              if (!field) {
                return null;
              }

              return (
                <ExerciseItem
                  key={field.id}
                  index={index}
                  control={control}
                  getValues={getValues}
                  exercises={formSession.exerciseNames}
                  exerciseName={exerciseName}
                  onRemove={() =>
                    replaceExercises(
                      removeExerciseAtIndex(getValues("exercises"), index),
                    )
                  }
                  onMoveUp={() =>
                    replaceExercises(
                      moveExerciseBlock(getValues("exercises"), index, "up"),
                    )
                  }
                  onMoveDown={() =>
                    replaceExercises(
                      moveExerciseBlock(getValues("exercises"), index, "down"),
                    )
                  }
                  onStartSupersetWithNext={() =>
                    replaceExercises(
                      startSupersetWithNext(
                        getValues("exercises"),
                        index,
                        createSupersetGroupId(),
                      ),
                    )
                  }
                  onJoinPreviousSuperset={() =>
                    replaceExercises(
                      joinSupersetWithPrevious(
                        getValues("exercises"),
                        index,
                        createSupersetGroupId,
                      ),
                    )
                  }
                  onRemoveFromSuperset={() =>
                    replaceExercises(
                      removeExerciseFromSuperset(getValues("exercises"), index),
                    )
                  }
                  isFirst={block.startIndex === 0}
                  isLast={block.endIndex === renderExercises.length - 1}
                  canStartSupersetWithNext={
                    index < renderExercises.length - 1 &&
                    !exerciseGroupId &&
                    !renderExercises[index + 1]?.supersetGroupId
                  }
                  canJoinPreviousSuperset={index > 0 && !exerciseGroupId}
                  isInSuperset={Boolean(exerciseGroupId)}
                  workoutId={formSession.workoutId}
                  templateExercise={templateExercise}
                />
              );
            });

            if (block.kind === "single") {
              return blockContent;
            }

            return (
              <div
                key={`superset-${renderExercises[block.startIndex]?.id ?? block.startIndex}`}
                className="border-primary/45 bg-primary/8 space-y-3 rounded-lg border border-dashed p-3"
              >
                <div className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
                  Superset
                </div>
                <div className="space-y-4">{blockContent}</div>
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                name: "",
                notes: "",
                supersetGroupId: null,
                sets: [{ weight: "", reps: "", rpe: "" }],
              })
            }
          >
            Add Exercise
          </Button>
        </FieldSet>

        <div className="border-border/80 bg-card rounded-lg border p-4 shadow-sm shadow-black/20">
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
                  className="text-muted-foreground text-sm font-semibold"
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
                      className="h-11 w-full pr-12 text-center text-lg tabular-nums"
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
