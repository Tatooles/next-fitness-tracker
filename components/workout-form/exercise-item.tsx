"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import ExerciseSelector from "@/components/workout-form/exercise-selector";
import ExerciseActionsMenu from "@/components/workout-form/exercise-actions-menu";
import FormSets from "@/components/workout-form/form-sets";
import {
  getFieldErrors,
  type WorkoutTanStackForm,
} from "@/components/workout-form/tanstack-form";
import type { ExerciseTemplateValues } from "@/components/workout-form/form-types";

interface ExerciseItemProps {
  index: number;
  form: WorkoutTanStackForm;
  exercises: string[];
  exerciseName: string;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onStartSupersetWithNext: () => void;
  onJoinPreviousSuperset: () => void;
  onRemoveFromSuperset: () => void;
  isFirst: boolean;
  isLast: boolean;
  canStartSupersetWithNext: boolean;
  canJoinPreviousSuperset: boolean;
  isInSuperset: boolean;
  workoutId?: number;
  templateExercise?: ExerciseTemplateValues;
}

export default function ExerciseItem({
  index,
  form,
  exercises,
  exerciseName,
  onRemove,
  onMoveUp,
  onMoveDown,
  onStartSupersetWithNext,
  onJoinPreviousSuperset,
  onRemoveFromSuperset,
  isFirst,
  isLast,
  canStartSupersetWithNext,
  canJoinPreviousSuperset,
  isInSuperset,
  workoutId,
  templateExercise,
}: ExerciseItemProps) {
  const exerciseTitle = exerciseName || `Exercise ${index + 1}`;
  const [isChangingExercise, setIsChangingExercise] = useState(!exerciseName);
  const shouldShowExerciseSelector = !exerciseName || isChangingExercise;

  return (
    <div className="border-border bg-card min-w-0 space-y-4 rounded-lg border p-3 shadow-md shadow-black/25 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
            Exercise {index + 1}
          </p>
          {shouldShowExerciseSelector ? (
            <form.Field name={`exercises[${index}].name`}>
              {(field) => (
                <Field className="mt-2">
                  <FieldLabel className="sr-only">Exercise</FieldLabel>
                  <ExerciseSelector
                    value={field.state.value}
                    onChange={(nextValue) => {
                      form.setFieldValue(`exercises[${index}].name`, nextValue);
                      setIsChangingExercise(false);
                    }}
                    exercises={exercises}
                    openOnMount={shouldShowExerciseSelector}
                    hideTriggerWhenOpen={shouldShowExerciseSelector}
                    onOpenChange={(nextOpen) => {
                      if (!nextOpen && exerciseName) {
                        setIsChangingExercise(false);
                      }
                    }}
                  />
                  <FieldError errors={getFieldErrors(field)} />
                </Field>
              )}
            </form.Field>
          ) : (
            <h3 className="text-foreground truncate text-lg leading-7 font-bold">
              {exerciseTitle}
            </h3>
          )}
        </div>
        <ExerciseActionsMenu
          exerciseName={exerciseName}
          workoutId={workoutId}
          onChangeExercise={
            exerciseName ? () => setIsChangingExercise(true) : undefined
          }
          onDelete={onRemove}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onStartSupersetWithNext={onStartSupersetWithNext}
          onJoinPreviousSuperset={onJoinPreviousSuperset}
          onRemoveFromSuperset={onRemoveFromSuperset}
          isFirst={isFirst}
          isLast={isLast}
          canStartSupersetWithNext={canStartSupersetWithNext}
          canJoinPreviousSuperset={canJoinPreviousSuperset}
          isInSuperset={isInSuperset}
        />
      </div>

      <FormSets
        exerciseIndex={index}
        form={form}
        templateExercise={templateExercise}
      />

      <form.Field name={`exercises[${index}].notes`}>
        {(field) => (
          <Field data-invalid={!field.state.meta.isValid}>
            <Textarea
              id={field.name}
              aria-invalid={!field.state.meta.isValid}
              placeholder="Add notes"
              className="resize-none text-base"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                form.setFieldValue(
                  `exercises[${index}].notes`,
                  event.target.value,
                )
              }
            />
            <FieldError errors={getFieldErrors(field)} />
          </Field>
        )}
      </form.Field>
    </div>
  );
}
