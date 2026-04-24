"use client";
import { Controller, Control, UseFormGetValues } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError } from "@/components/ui/field";
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
  return (
    <div className="border-border/80 bg-card space-y-4 rounded-lg border p-3 shadow-sm shadow-black/20 sm:p-4">
      <div className="flex items-center">
        <Controller
          control={control}
          name={`exercises.${index}.name`}
          render={({ field, fieldState }) => (
            <Field className="flex-1">
              <div className="flex items-center gap-2">
                <ExerciseSelector
                  value={field.value}
                  onChange={field.onChange}
                  exercises={exercises}
                />
                <ExerciseActionsMenu
                  exerciseName={exerciseName}
                  workoutId={workoutId}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
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
