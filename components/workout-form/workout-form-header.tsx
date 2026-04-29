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
    <div className="border-border bg-card grid min-w-0 grid-cols-1 gap-4 rounded-lg border p-4 shadow-md shadow-black/25 sm:gap-5 md:grid-cols-[minmax(0,1fr)_minmax(16rem,1.25fr)]">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_8rem] gap-3 sm:grid-cols-[minmax(0,1fr)_9rem] sm:gap-4">
        <Controller
          name="date"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor={field.name}
                className="text-foreground/85 text-sm font-semibold"
              >
                Date
              </FieldLabel>
              <Input
                id={field.name}
                aria-invalid={fieldState.invalid}
                type="date"
                className="h-10 w-full text-base sm:h-11"
                {...field}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
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
                className="text-foreground/85 text-sm font-semibold"
              >
                Workout Duration
              </FieldLabel>
              <div className="relative w-full">
                <Input
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  className="h-10 w-full pr-9 text-center text-base tabular-nums sm:h-11 sm:pr-10"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-2 flex items-center text-sm font-medium">
                  min
                </span>
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </div>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor={field.name}
              className="text-foreground/85 text-sm font-semibold"
            >
              Workout Name
            </FieldLabel>
            <Input
              id={field.name}
              aria-invalid={fieldState.invalid}
              className="h-10 text-base sm:h-11"
              placeholder="Enter workout name"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="notes"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="md:col-span-2">
            <FieldLabel
              htmlFor={field.name}
              className="text-foreground/85 text-sm font-semibold"
            >
              Workout Notes
            </FieldLabel>
            <Textarea
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="Add overall workout notes"
              className="min-h-24 resize-y text-base"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
