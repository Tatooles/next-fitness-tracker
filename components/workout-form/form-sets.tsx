import { Input } from "@/components/ui/input";
import { useFieldArray, Controller } from "react-hook-form";
import { Control, UseFormGetValues } from "react-hook-form";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type {
  ExerciseTemplateValues,
  WorkoutDraft,
} from "@/components/workout-form/form-types";

interface FormSetsProps {
  exerciseIndex: number;
  control: Control<WorkoutDraft>;
  getValues: UseFormGetValues<WorkoutDraft>;
  templateExercise?: ExerciseTemplateValues;
}

export default function FormSets({
  exerciseIndex,
  control,
  getValues,
  templateExercise,
}: FormSetsProps) {
  const { fields, remove, append } = useFieldArray({
    name: `exercises.${exerciseIndex}.sets`,
    control,
  });

  return (
    <FieldSet className="flex min-w-0 flex-col gap-2">
      <FieldLegend
        variant="label"
        className="text-foreground/80 text-xs font-semibold tracking-[0.18em] uppercase"
      >
        Sets
      </FieldLegend>
      <div className="text-muted-foreground grid grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.85fr)_2rem] items-center gap-1.5 px-1 text-center text-[0.68rem] font-semibold tracking-[0.16em] uppercase sm:gap-2">
        <span className="text-left">Set</span>
        <span>Weight</span>
        <span>Reps</span>
        <span>RPE</span>
        <span className="sr-only">Actions</span>
      </div>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.85fr)_2rem] items-center gap-1.5 rounded-md py-1 sm:gap-2"
        >
          <div className="text-muted-foreground flex h-10 items-center justify-start pl-1 text-sm font-semibold tabular-nums">
            {index + 1}
          </div>
          <Controller
            name={`exercises.${exerciseIndex}.sets.${index}.weight`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id={field.name}
                aria-label={`Set ${index + 1} weight`}
                placeholder={templateExercise?.sets[index]?.weight ?? "Weight"}
                inputMode="decimal"
                className="h-10 w-full px-1.5 text-center text-[16px] sm:px-2"
              />
            )}
          />
          <Controller
            name={`exercises.${exerciseIndex}.sets.${index}.reps`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id={field.name}
                aria-label={`Set ${index + 1} reps`}
                placeholder={templateExercise?.sets[index]?.reps ?? "Reps"}
                inputMode="decimal"
                className="h-10 w-full px-1.5 text-center text-[16px] sm:px-2"
              />
            )}
          />
          <Controller
            name={`exercises.${exerciseIndex}.sets.${index}.rpe`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id={field.name}
                aria-label={`Set ${index + 1} RPE`}
                placeholder={templateExercise?.sets[index]?.rpe ?? "RPE"}
                inputMode="decimal"
                className="h-10 w-full px-1.5 text-center text-[16px] sm:px-2"
              />
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => remove(index)}
            aria-label={`Delete set ${index + 1}`}
            title={`Delete set ${index + 1}`}
            className="text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 size={20} />
          </Button>
        </div>
      ))}
      <div className="flex gap-3 sm:gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              weight: "",
              reps: "",
              rpe: "",
            })
          }
        >
          Add set
        </Button>
        {fields.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                weight: getValues(
                  `exercises.${exerciseIndex}.sets.${fields.length - 1}.weight`,
                ),
                reps: getValues(
                  `exercises.${exerciseIndex}.sets.${fields.length - 1}.reps`,
                ),
                rpe: getValues(
                  `exercises.${exerciseIndex}.sets.${fields.length - 1}.rpe`,
                ),
              })
            }
          >
            Clone set
          </Button>
        )}
      </div>
    </FieldSet>
  );
}
