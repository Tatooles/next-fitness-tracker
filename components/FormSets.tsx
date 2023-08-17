import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFieldArray } from "react-hook-form";

export default function FormSets({
  exerciseIndex,
  control,
  register,
}: {
  exerciseIndex: number;
  control: any;
  register: any;
}) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `exercise[${exerciseIndex}].setArray`,
  });
  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Label>Set {index + 1}</Label>
          <Input
            {...register(`exercise[${exerciseIndex}].setArray[${index}].reps`)}
            placeholder="Reps"
            inputMode="numeric"
          ></Input>
          <Input
            {...register(
              `exercise[${exerciseIndex}].setArray[${index}].weight`
            )}
            placeholder="Weight"
            inputMode="numeric"
          ></Input>
          <Button onClick={() => remove(index)}>Delete Set</Button>
        </div>
      ))}
      <Button
        onClick={() =>
          append({
            reps: "",
            weight: "",
          })
        }
      >
        Add set
      </Button>
    </div>
  );
}
