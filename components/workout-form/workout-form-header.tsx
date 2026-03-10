"use client";
import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { TWorkoutFormSchema } from "@/lib/types";

interface WorkoutFormHeaderProps {
  control: Control<TWorkoutFormSchema>;
}

export default function WorkoutFormHeader({ control }: WorkoutFormHeaderProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
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
      <Controller
        name="durationMinutes"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor={field.name}
              className="text-base font-semibold"
            >
              Workout Duration
            </FieldLabel>
            <Input
              id={field.name}
              aria-invalid={fieldState.invalid}
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              className="bg-background/50 hover:bg-background/80 h-10 text-base transition-colors sm:h-11"
              placeholder="Minutes"
              value={field.value ?? ""}
              onChange={(event) =>
                field.onChange(
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
                )
              }
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="notes"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="md:col-span-3">
            <FieldLabel
              htmlFor={field.name}
              className="text-base font-semibold"
            >
              Workout Notes
            </FieldLabel>
            <Textarea
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Add overall workout notes"
              className="bg-background/50 hover:bg-background/80 min-h-24 resize-y text-base transition-colors"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
