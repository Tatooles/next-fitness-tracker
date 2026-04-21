import { Workout, ExerciseInstance } from "@/lib/types";
import { formatDate, formatWorkoutDuration } from "@/lib/utils";
import { groupExercisesForDisplay } from "@/lib/superset-utils";
import { toast } from "sonner";

function formatExerciseText(exercise: ExerciseInstance) {
  let text = `${exercise.name}\n`;

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

  if (exercise.notes && exercise.notes.trim()) {
    text += `Notes: ${exercise.notes}\n`;
  }

  return text;
}

export const copyWorkoutToClipboard = async (workout: Workout) => {
  try {
    // Build the plain text representation
    let text = `${workout.name} - ${formatDate(workout.date)}\n\n`;

    if (workout.durationMinutes) {
      text += `Duration: ${formatWorkoutDuration(workout.durationMinutes)}\n\n`;
    }

    if (workout.notes.trim()) {
      text += `Notes: ${workout.notes}\n\n`;
    }

    const blocks = groupExercisesForDisplay(workout.exercises);

    blocks.forEach((block, idx) => {
      if (block.kind === "superset") {
        text += "Superset\n";
      }

      block.exercises.forEach((exercise) => {
        text += formatExerciseText(exercise);
        text += "\n";
      });

      if (idx === blocks.length - 1) {
        text = text.trimEnd();
        return;
      }

      text += "\n";
    });

    // Copy to clipboard
    await navigator.clipboard.writeText(text);
    toast.success("Workout copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy workout:", error);
    toast.error("Failed to copy workout to clipboard");
  }
};
