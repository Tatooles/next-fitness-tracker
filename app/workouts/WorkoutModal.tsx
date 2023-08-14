import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Workout } from "@/lib/types";
import {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  date: z.date(),
  name: z
    .string()
    .min(1, {
      message: "Wokout name must be at least 1 character",
    })
    .max(50),
});

export default function WorkoutModal({
  modalOpen,
  setModalOpen,
  editWorkoutValue,
  setShowSpinner,
}: {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editWorkoutValue: Workout | undefined;
  setShowSpinner: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  /**
   * This function handles the logic of saving the form the user has filled out. This save is for
   * creating new and editing existing as well as duplicate workouts. In the case of editing a
   * workout, the workout in the form is compared to the workout that was passed in and the save
   * call is only made if the value was changed
   */
  const handleSubmit = async () => {
    // TODO: Replace this function with a server action
    setModalOpen(false);
    setShowSpinner(true);

    // if (!editWorkoutValue || editWorkoutValue.id === -2) {
    //   // If adding or duplicating, just create new workout
    //   await addToDB();
    //   router.refresh();
    // } else if (JSON.stringify(editWorkoutValue) !== JSON.stringify(formData)) {
    //   // If updating, call delete to delete the existing workout, then addToDB to add udpated one
    //   await Promise.all([deleteWorkout(editWorkoutValue.id), addToDB()]);
    //   router.refresh();
    // }
    setShowSpinner(false);
  };

  const addToDB = async () => {
    await fetch("/api/workouts", {
      method: "POST",
      // body: JSON.stringify({
      //   workout: formData,
      // }),
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("submitting");
    console.log(values);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      name: "",
    },
  });

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="max-h-[90%] w-5/6 overflow-y-scroll rounded-lg"
      >
        <DialogHeader>
          <DialogTitle>
            {editWorkoutValue ? "Edit Workout" : "Create Workout"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date"></Input>
                  </FormControl>
                  <FormDescription>
                    Enter the date this workout occurred.
                  </FormDescription>
                </FormItem>
              )}
            ></FormField>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
