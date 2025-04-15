import { Input } from "@/components/ui/input";
import { useFieldArray } from "react-hook-form";
import { Control, UseFormGetValues } from "react-hook-form";
import { TWorkoutFormSchema } from "@/lib/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Trash2 } from "lucide-react";

export default function FormSets({
  exerciseIndex,
  control,
  getValues,
  placeholders,
}: {
  exerciseIndex: number;
  control: Control<TWorkoutFormSchema>;
  getValues: UseFormGetValues<TWorkoutFormSchema>;
  placeholders?: TWorkoutFormSchema;
}) {
  const { fields, remove, append } = useFieldArray({
    name: `exercises.${exerciseIndex}.sets`,
    control,
  });

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center justify-between">
          <FormLabel>Set {index + 1}</FormLabel>
          <FormField
            control={control}
            name={`exercises.${exerciseIndex}.sets.${index}.weight`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={
                      placeholders?.exercises[exerciseIndex].sets[index]
                        .weight ?? "Weight"
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
                      placeholders?.exercises[exerciseIndex].sets[index].reps ??
                      "Reps"
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
                      placeholders?.exercises[exerciseIndex].sets[index].rpe ??
                      "RPE"
                    }
                    inputMode="decimal"
                    className="w-20 text-[16px]"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Trash2
            onClick={() => remove(index)}
            size={20}
            className="text-red-600 cursor-pointer"
          ></Trash2>
        </div>
      ))}
      <div className="flex gap-2">
        <button
          type="button"
          className="w-20 rounded-md bg-green-500 py-1 text-sm text-white"
          onClick={() =>
            append({
              weight: "",
              reps: "",
              rpe: "",
            })
          }
        >
          Add set
        </button>
        {fields.length > 0 && (
          <button
            type="button"
            className="w-20 rounded-md bg-blue-600 py-1 text-sm text-white"
            onClick={() =>
              append({
                weight: getValues(
                  `exercises.${exerciseIndex}.sets.${fields.length - 1}.weight`
                ),
                reps: getValues(
                  `exercises.${exerciseIndex}.sets.${fields.length - 1}.reps`
                ),
                rpe: getValues(
                  `exercises.${exerciseIndex}.sets.${fields.length - 1}.rpe`
                ),
              })
            }
          >
            Clone set
          </button>
        )}
      </div>
    </div>
  );
}
