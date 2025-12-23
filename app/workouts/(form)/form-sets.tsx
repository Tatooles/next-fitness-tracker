import { Input } from "@/components/ui/input";
import { useFieldArray } from "react-hook-form";
import { Control, UseFormGetValues } from "react-hook-form";
import { ExerciseThin, TWorkoutFormSchema } from "@/lib/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function FormSets({
  exerciseName,
  exerciseIndex,
  control,
  getValues,
  placeholderValues,
}: {
  exerciseName: string;
  exerciseIndex: number;
  control: Control<TWorkoutFormSchema>;
  getValues: UseFormGetValues<TWorkoutFormSchema>;
  placeholderValues?: ExerciseThin[];
}) {
  const { fields, remove, append } = useFieldArray({
    name: `exercises.${exerciseIndex}.sets`,
    control,
  });

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center justify-between gap-2">
          <FormLabel className="whitespace-nowrap">Set {index + 1}</FormLabel>
          <FormField
            control={control}
            name={`exercises.${exerciseIndex}.sets.${index}.weight`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={
                      placeholderValues?.find((x) => x.name === exerciseName)
                        ?.sets[index]?.weight ?? "Weight"
                    }
                    inputMode="decimal"
                    className="w-20 text-[16px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`exercises.${exerciseIndex}.sets.${index}.reps`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={
                      placeholderValues?.find((x) => x.name === exerciseName)
                        ?.sets[index]?.reps ?? "Reps"
                    }
                    inputMode="decimal"
                    className="w-16 text-[16px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`exercises.${exerciseIndex}.sets.${index}.rpe`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={
                      placeholderValues?.find((x) => x.name === exerciseName)
                        ?.sets[index]?.rpe ?? "RPE"
                    }
                    inputMode="decimal"
                    className="w-20 text-[16px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            className="hover:bg-destructive/10 hover:text-destructive text-red-600 transition-colors"
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
          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
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
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
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
    </div>
  );
}
