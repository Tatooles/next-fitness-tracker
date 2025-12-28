"use client";
import { Controller, Control, UseFormGetValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { Field, FieldError } from "@/components/ui/field";
import ExerciseSelector from "@/components/workout-form/exercise-selector";
import FormSets from "@/components/workout-form/form-sets";
import ExerciseHistoryModal from "@/components/exercise/exercise-history-modal";
import { TWorkoutFormSchema, ExerciseThin } from "@/lib/types";

interface ExerciseItemProps {
  index: number;
  control: Control<TWorkoutFormSchema>;
  getValues: UseFormGetValues<TWorkoutFormSchema>;
  exercises: string[];
  exerciseName: string;
  onRemove: () => void;
  workoutId: number;
  placeholderValues?: ExerciseThin[];
}

export default function ExerciseItem({
  index,
  control,
  getValues,
  exercises,
  exerciseName,
  onRemove,
  workoutId,
  placeholderValues,
}: ExerciseItemProps) {
  return (
    <div className="relative rounded-lg border p-3 shadow-xs transition-all hover:shadow-md">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
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
                  {exerciseName && exercises.includes(exerciseName) && (
                    <ExerciseHistoryModal
                      exerciseName={exerciseName}
                      filterOutWorkoutId={workoutId}
                    />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="hover:bg-destructive/10 hover:text-destructive shrink-0 transition-colors"
                    onClick={onRemove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <FormSets
          exerciseName={exerciseName}
          exerciseIndex={index}
          control={control}
          getValues={getValues}
          placeholderValues={placeholderValues}
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
                className="bg-background/50 hover:bg-background/80 resize-none text-base transition-colors"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}
