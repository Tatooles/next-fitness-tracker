"use client";
import { useState } from "react";
import { Controller, Control, UseFormGetValues } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import ExerciseSelector from "@/components/workout-form/exercise-selector";
import ExerciseActionsMenu from "@/components/workout-form/exercise-actions-menu";
import FormSets from "@/components/workout-form/form-sets";
import type {
  ExerciseTemplateValues,
  WorkoutDraft,
} from "@/components/workout-form/form-types";

interface ExerciseItemProps {
  index: number;
  control: Control<WorkoutDraft>;
  getValues: UseFormGetValues<WorkoutDraft>;
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
  control,
  getValues,
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
            <Controller
              control={control}
              name={`exercises.${index}.name`}
              render={({ field, fieldState }) => (
                <Field className="mt-2">
                  <FieldLabel className="sr-only">Exercise</FieldLabel>
                  <ExerciseSelector
                    value={field.value}
                    onChange={(nextValue) => {
                      field.onChange(nextValue);
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
        control={control}
        getValues={getValues}
        templateExercise={templateExercise}
      />

      <Controller
        control={control}
        name={`exercises.${index}.notes`}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Add notes"
              className="resize-none text-base"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
