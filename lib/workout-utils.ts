import { Workout, ExerciseInstance } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export const copyWorkoutToClipboard = async (workout: Workout) => {
  try {
    // Build the plain text representation
    let text = `${workout.name} - ${formatDate(workout.date)}\n\n`;

    workout.exercises.forEach((exercise: ExerciseInstance, idx: number) => {
      text += `${exercise.name}\n`;

      // Add sets
      exercise.sets.forEach((set, setIdx) => {
        text += `Set ${setIdx + 1}: `;

        if (set.weight) {
          text += `${set.weight} lbs`;
        }

        if (set.reps) {
          text += ` x ${set.reps} reps`;
        }

        if (set.rpe) {
          text += ` @ RPE ${set.rpe}`;
        }

        text += "\n";
      });

      // Add notes after sets if they exist
      if (exercise.notes && exercise.notes.trim()) {
        text += `Notes: ${exercise.notes}\n`;
      }

      // Add blank line between exercises (but not after the last one)
      if (idx < workout.exercises.length - 1) {
        text += "\n";
      }
    });

    // Copy to clipboard
    await navigator.clipboard.writeText(text);
    toast.success("Workout copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy workout:", error);
    toast.error("Failed to copy workout to clipboard");
  }
};
