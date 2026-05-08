"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  getFieldErrors,
  type WorkoutTanStackForm,
} from "@/components/workout-form/tanstack-form";

interface WorkoutFormHeaderProps {
  form: WorkoutTanStackForm;
}

export default function WorkoutFormHeader({ form }: WorkoutFormHeaderProps) {
  return (
    <div className="border-border bg-card grid min-w-0 grid-cols-1 gap-4 rounded-lg border p-4 shadow-md shadow-black/25 sm:gap-5 md:grid-cols-[minmax(0,1fr)_minmax(16rem,1.25fr)]">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_8rem] gap-3 sm:grid-cols-[minmax(0,1fr)_9rem] sm:gap-4">
        <form.Field name="date">
          {(field) => (
            <Field data-invalid={!field.state.meta.isValid}>
              <FieldLabel
                htmlFor={field.name}
                className="text-foreground/85 text-sm font-semibold"
              >
                Date
              </FieldLabel>
              <Input
                id={field.name}
                aria-invalid={!field.state.meta.isValid}
                type="date"
                className="h-10 w-full text-base sm:h-11"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  form.setFieldValue("date", event.target.value)
                }
              />
              <FieldError errors={getFieldErrors(field)} />
            </Field>
          )}
        </form.Field>
        <form.Field name="durationMinutes">
          {(field) => (
            <Field data-invalid={!field.state.meta.isValid}>
              <FieldLabel
                htmlFor={field.name}
                className="text-foreground/85 text-sm font-semibold"
              >
                Workout Duration
              </FieldLabel>
              <div className="relative w-full">
                <Input
                  id={field.name}
                  aria-invalid={!field.state.meta.isValid}
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  className="h-10 w-full pr-9 text-center text-base tabular-nums sm:h-11 sm:pr-10"
                  value={field.state.value ?? ""}
                  onChange={(event) =>
                    form.setFieldValue(
                      "durationMinutes",
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                    )
                  }
                  onBlur={field.handleBlur}
                  name={field.name}
                />
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-2 flex items-center text-sm font-medium">
                  min
                </span>
              </div>
              <FieldError errors={getFieldErrors(field)} />
            </Field>
          )}
        </form.Field>
      </div>
      <form.Field name="name">
        {(field) => (
          <Field data-invalid={!field.state.meta.isValid}>
            <FieldLabel
              htmlFor={field.name}
              className="text-foreground/85 text-sm font-semibold"
            >
              Workout Name
            </FieldLabel>
            <Input
              id={field.name}
              aria-invalid={!field.state.meta.isValid}
              className="h-10 text-base sm:h-11"
              placeholder="Enter workout name"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                form.setFieldValue("name", event.target.value)
              }
            />
            <FieldError errors={getFieldErrors(field)} />
          </Field>
        )}
      </form.Field>
      <form.Field name="notes">
        {(field) => (
          <Field
            data-invalid={!field.state.meta.isValid}
            className="md:col-span-2"
          >
            <FieldLabel
              htmlFor={field.name}
              className="text-foreground/85 text-sm font-semibold"
            >
              Workout Notes
            </FieldLabel>
            <Textarea
              id={field.name}
              aria-invalid={!field.state.meta.isValid}
              placeholder="Add overall workout notes"
              className="min-h-24 resize-y text-base"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) =>
                form.setFieldValue("notes", event.target.value)
              }
            />
            <FieldError errors={getFieldErrors(field)} />
          </Field>
        )}
      </form.Field>
    </div>
  );
}
