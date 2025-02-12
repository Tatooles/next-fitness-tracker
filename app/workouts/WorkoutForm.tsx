"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FormSets from "@/app/workouts/FormSets";
import Spinner from "@/components/Spinner";
import { workoutFormSchema, TWorkoutFormSchema } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [exercises, setExercises] = useState([]);

  const router = useRouter();

  useEffect(() => {
    async function fetchExercises() {
      const response = await fetch("/api/exercises");
      const data = await response.json();
      // FIXME: Filter out empty??
      setExercises(data);
    }
    fetchExercises();
  }, []);

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

  const form = useForm<z.infer<typeof workoutFormSchema>>({
    resolver: zodResolver(workoutFormSchema),
    values: workoutValue,
  });

  const { fields, append, remove } = useFieldArray({
    name: "exercises",
    control: form.control,
  });

  // TODO: May have to rewrite whole thing with shadcn ui form
  // Which isn't necessarily a bad thing

  return (
    <div className="mx-auto p-4 sm:max-w-md">
      <h2 className="text-center text-2xl">
        {workoutId !== -1 ? "Edit Workout" : "Create Workout"}
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col text-left"
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date:</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="mt-2 mb-4 text-[16px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workout Name:</FormLabel>
                <FormControl>
                  <Input className="text-[16px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Label>Exercises</Label>
            {fields.map((field, index) => (
              <div
                className="form-control flex flex-col gap-4 border-b-2 border-slate-700 px-2 py-4"
                key={field.id}
              >
                <div className="flex items-center">
                  <FormField
                    control={form.control}
                    name={`exercises.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? exercises.find(
                                      (exercise) => exercise === field.value
                                    )
                                  : "Select exercise"}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search exercise..."
                                className="h-9"
                              />
                              <CommandList>
                                {/* TODO: Update this so I can add a new exercise */}
                                <CommandEmpty
                                  onClick={() => {
                                    console.log(
                                      "adding new exercise, exercise field.value",
                                      field.value
                                    );
                                    form.setValue(
                                      `exercises.${index}.name`,
                                      field.value
                                    );
                                  }}
                                >
                                  Add new exercise +
                                </CommandEmpty>
                                <CommandGroup>
                                  {exercises.map((exercise) => (
                                    <CommandItem
                                      value={exercise}
                                      key={exercise}
                                      onSelect={() => {
                                        form.setValue(
                                          `exercises.${index}.name`,
                                          exercise
                                        );
                                      }}
                                    >
                                      {exercise}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          exercise === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
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
                  control={form.control}
                  getValues={form.getValues}
                />
                <FormField
                  control={form.control}
                  name={`exercises.${index}.notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Notes"
                          className="text-[16px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                  sets: [{ weight: "", reps: "", rpe: "" }],
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
      </Form>
      <Spinner show={showSpinner}></Spinner>
    </div>
  );
}
