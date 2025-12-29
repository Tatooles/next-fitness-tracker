"use client";
import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { TWorkoutFormSchema } from "@/lib/types";

interface WorkoutFormHeaderProps {
  control: Control<TWorkoutFormSchema>;
}

export default function WorkoutFormHeader({ control }: WorkoutFormHeaderProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
      <Controller
        name="date"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor={field.name}
              className="text-base font-semibold"
            >
              Date
            </FieldLabel>
            <Input
              id={field.name}
              aria-invalid={fieldState.invalid}
              type="date"
              className="bg-background/50 hover:bg-background/80 h-10 w-full text-base transition-colors sm:h-11"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor={field.name}
              className="text-base font-semibold"
            >
              Workout Name
            </FieldLabel>
            <Input
              id={field.name}
              aria-invalid={fieldState.invalid}
              className="bg-background/50 hover:bg-background/80 h-10 text-base transition-colors sm:h-11"
              placeholder="Enter workout name"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
