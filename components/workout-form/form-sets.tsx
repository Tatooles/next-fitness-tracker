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
    <FieldSet className="flex flex-col gap-2">
      <FieldLegend
        variant="label"
        className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase"
      >
        Sets
      </FieldLegend>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border-border/70 bg-secondary/45 flex items-center justify-between gap-2 rounded-md border p-2"
        >
          <Controller
            name={`exercises.${exerciseIndex}.sets.${index}.weight`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id={field.name}
                placeholder={templateExercise?.sets[index]?.weight ?? "Weight"}
                inputMode="decimal"
                className="h-10 w-20 text-center text-[16px]"
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
                placeholder={templateExercise?.sets[index]?.reps ?? "Reps"}
                inputMode="decimal"
                className="h-10 w-16 text-center text-[16px]"
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
                placeholder={templateExercise?.sets[index]?.rpe ?? "RPE"}
                inputMode="decimal"
                className="h-10 w-20 text-center text-[16px]"
              />
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
