"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import ExerciseItem from "@/components/workout-form/exercise-item";
import WorkoutFormHeader from "@/components/workout-form/workout-form-header";
import { LoadingOverlay } from "@/components/loading-overlay";
import {
  workoutFormSchema,
  TWorkoutFormSchema,
  ExerciseThin,
} from "@/lib/types";
import { toast, Toaster } from "sonner";
import * as z from "zod";
import { FieldLegend, FieldSet } from "@/components/ui/field";
interface WorkoutFormProps {
  editMode: boolean;
  workoutValue: TWorkoutFormSchema;
  workoutId: number;
  placeholderValues?: ExerciseThin[];
}

export default function WorkoutForm({
  editMode,
  workoutValue,
  workoutId,
  placeholderValues,
}: WorkoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchExercises() {
      const response = await fetch("/api/exercises");
      const data: string[] = await response.json();
      setExercises(data);
    }
    fetchExercises();
  }, []);

  const onSubmit = async (values: TWorkoutFormSchema) => {
    setIsLoading(true);
    if (!editMode) {
      await addWorkout(values);
      router.push("/workouts");
    } else {
      await updateWorkout(workoutId, values);
    }
    setIsLoading(false);
  };

  /**
   * Creates a new workout with the values from the form
   *
   * @param form the form values to create the workout with
   */
  const addWorkout = async (form: TWorkoutFormSchema) => {
    await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("Failed to add workout");
        }
      })
      .catch((error) => {
        console.error("An error occurred while adding exercise:", error);
        toast.error("Failed to add workout");
      });
  };

  /**
   * Updates an existing workout with the values from the form
   *
   * @param id the id of the workout to update
   * @param form the form values to update the workout with
   */
  const updateWorkout = async (id: number, form: TWorkoutFormSchema) => {
    await fetch(`/api/workouts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("Failed to save workout");
        } else {
          toast.success("Saved workout");
        }
      })
      .catch((error) => {
        console.error("An error occurred while updating exercise:", error);
        toast.error("Failed to save workout");
      });
  };

  const form = useForm<z.infer<typeof workoutFormSchema>>({
    resolver: zodResolver(workoutFormSchema),
    values: workoutValue,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  const watchedExercises = useWatch({
    control: form.control,
    name: "exercises",
  });

  // Set today's date if date is empty (for create mode)
  useEffect(() => {
    if (!workoutValue.date) {
      form.setValue("date", new Date().toLocaleDateString("en-CA"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-2 sm:px-6">
      <LoadingOverlay isLoading={isLoading} />
      <Toaster richColors position="top-center" />
      <div className="space-y-4 rounded-lg p-3 shadow-lg sm:space-y-6 sm:p-6">
        <h2 className="from-primary to-primary/60 mb-4 bg-linear-to-r bg-clip-text text-center text-2xl font-bold text-transparent sm:mb-8 sm:text-3xl">
          {workoutId !== -1 ? "Edit Workout" : "Create Workout"}
        </h2>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <WorkoutFormHeader control={form.control} />

          <FieldSet className="space-y-3 sm:space-y-4">
            <FieldLegend className="text-base font-semibold sm:text-lg">
              Exercises
            </FieldLegend>

            {fields.map((field, index) => (
              <ExerciseItem
                key={field.id}
                index={index}
                control={form.control}
                getValues={form.getValues}
                exercises={exercises}
                exerciseName={watchedExercises?.[index]?.name || ""}
                onRemove={() => remove(index)}
                workoutId={workoutId}
                placeholderValues={placeholderValues}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  name: "",
                  notes: "",
                  sets: [{ weight: "", reps: "", rpe: "" }],
                })
              }
              className="hover:bg-primary/10 w-full text-base"
            >
              Add Exercise
            </Button>
          </FieldSet>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 w-full text-base"
              disabled={isLoading}
            >
              {editMode ? "Save" : "Create Workout"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
