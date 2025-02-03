"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FormSets from "@/components/FormSets";
import Spinner from "@/components/Spinner";
import { workoutFormSchema, TWorkoutFormSchema } from "@/lib/types";

export default function WorkoutForm({
  editMode,
  workoutValue,
  workoutId,
}: {
  editMode: boolean;
  workoutValue: TWorkoutFormSchema;
  workoutId: number;
}) {
  const [showSpinner, setShowSpinner] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: TWorkoutFormSchema) => {
    setShowSpinner(true);

    if (!editMode) {
      // If creating or duplicating, just create new workout
      await addToDB(values);
      router.refresh();
    } else {
      // If editing, delete existing workout, then add new one
      await Promise.all([deleteWorkout(workoutId), addToDB(values)]);
      router.refresh();
    }
    router.push("/workouts");
  };

  const addToDB = async (form: TWorkoutFormSchema) => {
    await fetch("/api/workouts", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Failed to add exercise.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while adding exercise:", error);
      });
  };

  const deleteWorkout = async (id: number) => {
    await fetch(`/api/workouts/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Failed to delete exercise.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while deleting exercise:", error);
      });
  };

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    getValues,
  } = useForm<TWorkoutFormSchema>({
    resolver: zodResolver(workoutFormSchema),
    values: workoutValue,
  });

  const { fields, append, remove } = useFieldArray({
    name: "exercises",
    control,
  });

  return (
    <div className="mx-auto p-4 sm:max-w-md">
      <h2 className="text-center text-2xl">
        {workoutId !== -1 ? "Edit Workout" : "Create Workout"}
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col text-left"
      >
        <Label htmlFor="date">Date:</Label>
        <Input
          type="date"
          id="date"
          className="mt-2 mb-4 text-[16px]"
          {...register("date")}
        ></Input>
        <Label htmlFor="name">Workout Name:</Label>
        <div className="mt-2 mb-4">
          <Input
            type="text"
            id="name"
            className="text-[16px]"
            {...register("name")}
          ></Input>
          {errors.name && (
            <p className="mt-2 text-sm font-medium text-destructive">{`${errors.name.message}`}</p>
          )}
        </div>
        <div>
          <Label>Exercises</Label>
          {fields.map((field, index) => (
            <div
              className="form-control flex flex-col gap-4 border-b-2 border-slate-700 px-2 py-4"
              key={field.id}
            >
              <div className="flex items-center">
                <Input
                  {...register(`exercises.${index}.name` as const)}
                  placeholder="Exercise name"
                  className="text-[16px]"
                />
                <div
                  onClick={() => remove(index)}
                  className="ml-5 h-6 w-7 cursor-pointer rounded-full bg-red-600 text-center text-white"
                >
                  <div className="-translate-y-[1px]">-</div>
                </div>
              </div>
              <FormSets
                exerciseIndex={index}
                {...{ control, register, getValues }}
              />
              <Textarea
                {...register(`exercises.${index}.notes` as const)}
                placeholder="Notes"
                className="text-[16px]"
              ></Textarea>
            </div>
          ))}
          <Button
            variant="secondary"
            className="mt-4 w-full"
            type="button"
            onClick={() =>
              append({
                name: "",
                notes: "",
                sets: [{ weight: "", reps: "", rpe: null }],
              })
            }
          >
            Add Exercise
          </Button>
        </div>
        <Button type="submit" className="mt-4 self-center">
          Submit
        </Button>
      </form>
      <Spinner show={showSpinner}></Spinner>
    </div>
  );
}
