import { Input } from "@/components/ui/input";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type {
  WorkoutFieldName,
  WorkoutSetDraft,
  WorkoutSetsFieldName,
  WorkoutTanStackForm,
} from "@/components/workout-form/tanstack-form";
import type { ExerciseTemplateValues } from "@/components/workout-form/form-types";

interface FormSetsProps {
  exerciseIndex: number;
  form: WorkoutTanStackForm;
  templateExercise?: ExerciseTemplateValues;
}

const setFieldName = (
  exerciseIndex: number,
  setIndex: number,
  fieldName: keyof WorkoutSetDraft,
) =>
  `exercises[${exerciseIndex}].sets[${setIndex}].${fieldName}` as WorkoutFieldName;

const exerciseSetsFieldName = (exerciseIndex: number) =>
  `exercises[${exerciseIndex}].sets` as WorkoutSetsFieldName;

function SetValueField({
  form,
  fieldName,
  label,
  placeholder,
}: {
  form: WorkoutTanStackForm;
  fieldName: WorkoutFieldName;
  label: string;
  placeholder: string;
}) {
  return (
    <form.Field name={fieldName}>
      {(field) => (
        <Input
          id={field.name}
          aria-label={label}
          placeholder={placeholder}
          inputMode="decimal"
          className="h-10 w-full px-1.5 text-center text-[16px] sm:px-2"
          name={field.name}
          value={String(field.state.value ?? "")}
          onBlur={field.handleBlur}
          onChange={(event) =>
            form.setFieldValue(fieldName, event.target.value)
          }
        />
      )}
    </form.Field>
  );
}

export default function FormSets({
  exerciseIndex,
  form,
  templateExercise,
}: FormSetsProps) {
  const setsFieldName = exerciseSetsFieldName(exerciseIndex);

  return (
    <form.Field name={setsFieldName} mode="array">
      {(setsField) => (
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
          {setsField.state.value.map((_set: WorkoutSetDraft, index) => (
            <div
              key={index}
              className="grid grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.85fr)_2rem] items-center gap-1.5 rounded-md py-1 sm:gap-2"
            >
              <div className="text-muted-foreground flex h-10 items-center justify-start pl-1 text-sm font-semibold tabular-nums">
                {index + 1}
              </div>
              <SetValueField
                form={form}
                fieldName={setFieldName(exerciseIndex, index, "weight")}
                label={`Set ${index + 1} weight`}
                placeholder={templateExercise?.sets[index]?.weight ?? "Weight"}
              />
              <SetValueField
                form={form}
                fieldName={setFieldName(exerciseIndex, index, "reps")}
                label={`Set ${index + 1} reps`}
                placeholder={templateExercise?.sets[index]?.reps ?? "Reps"}
              />
              <SetValueField
                form={form}
                fieldName={setFieldName(exerciseIndex, index, "rpe")}
                label={`Set ${index + 1} RPE`}
                placeholder={templateExercise?.sets[index]?.rpe ?? "RPE"}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setsField.removeValue(index)}
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
                setsField.pushValue({
                  weight: "",
                  reps: "",
                  rpe: "",
                })
              }
            >
              Add set
            </Button>
            {setsField.state.value.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const lastSetIndex = setsField.state.value.length - 1;

                  setsField.pushValue({
                    weight: String(
                      form.getFieldValue(
                        setFieldName(exerciseIndex, lastSetIndex, "weight"),
                      ) ?? "",
                    ),
                    reps: String(
                      form.getFieldValue(
                        setFieldName(exerciseIndex, lastSetIndex, "reps"),
                      ) ?? "",
                    ),
                    rpe: String(
                      form.getFieldValue(
                        setFieldName(exerciseIndex, lastSetIndex, "rpe"),
                      ) ?? "",
                    ),
                  });
                }}
              >
                Clone set
              </Button>
            )}
          </div>
        </FieldSet>
      )}
    </form.Field>
  );
}
