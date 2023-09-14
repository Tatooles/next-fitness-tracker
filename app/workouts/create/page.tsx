"use client";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FormSets from "@/components/FormSets";

export default async function CreateWorkoutPage() {
  /**
   * This function handles the logic of saving the form the user has filled out. This save is for
   * creating new and editing existing as well as duplicate workouts.
   */
  const onSubmit = (values: any) => {
    console.log(values);
  };

  const addToDB = async (form: any) => {
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

  const { handleSubmit, register } = useForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)} // Just having handlesubmit at all freezes the whole browser :)
      className="flex flex-col"
    >
      <Label htmlFor="date">Date:</Label>
      <Input
        type="date"
        className="mt-2 mb-4 text-[16px]"
        {...register("date")}
      ></Input>
      <Label htmlFor="name">Workout Name:</Label>
      <div className="mt-2 mb-4">
        <Input
          type="text"
          className="text-[16px]"
          {...register("name")}
        ></Input>
      </div>
      <Button type="submit" className="mt-4 self-center">
        Submit
      </Button>
    </form>
  );
}
