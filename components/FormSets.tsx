import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFieldArray } from "react-hook-form";

export default function FormSets({
  exerciseIndex,
  control,
  register,
  getValues,
}: {
  exerciseIndex: number;
  control: any;
  register: any;
  getValues: any;
}) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `exercise[${exerciseIndex}].setArray`,
  });
  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center justify-between">
          <Label>Set {index + 1}</Label>
          <Input
            {...register(`exercise[${exerciseIndex}].setArray[${index}].reps`)}
            placeholder="Reps"
            inputMode="numeric"
            className="w-16 text-[16px]"
          ></Input>
          <Input
            {...register(
              `exercise[${exerciseIndex}].setArray[${index}].weight`
            )}
            placeholder="Weight"
            inputMode="numeric"
            className="w-20 text-[16px]"
          ></Input>
          <div onClick={() => remove(index)} className="p-2">
            <div className="h-4 w-4 cursor-pointer rounded-full bg-red-600 p-2 text-center text-white">
              <div className="-translate-y-[13px] -translate-x-[4px]">-</div>
            </div>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <button
          type="button"
          className="w-20 rounded-md bg-green-500 py-1 text-sm text-white"
          onClick={() =>
            append({
              reps: "",
              weight: "",
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
                reps: getValues(
                  `exercise[${exerciseIndex}].setArray[${
                    fields.length - 1
                  }].reps`
                ),
                weight: getValues(
                  `exercise[${exerciseIndex}].setArray.[${
                    fields.length - 1
                  }].weight`
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
