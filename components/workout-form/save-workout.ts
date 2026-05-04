"use client";

import { toast } from "sonner";
import * as z from "zod";
import type {
  PersistMode,
  WorkoutDraft,
} from "@/components/workout-form/form-types";
import { parseJsonResponse } from "@/lib/json-response";

type SaveWorkoutInput = {
  persistMode: PersistMode;
  values: WorkoutDraft;
  workoutId?: number;
};

type SaveWorkoutResult = { ok: true; workoutId: number } | { ok: false };

type SaveRequestConfig = {
  url: string;
  method: "POST" | "PATCH";
  failureMessage: string;
  errorContext: string;
};

const createWorkoutResponseSchema = z.object({
  workoutId: z.number().int().positive(),
});

async function performSaveRequest(
  values: WorkoutDraft,
  { url, method, failureMessage, errorContext }: SaveRequestConfig,
): Promise<Response | null> {
  try {
    const response = await fetch(url, {
      method,
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`${errorContext}: request failed`, {
        method,
        url,
        status: response.status,
      });
      toast.error(failureMessage);
      return null;
    }

    return response;
  } catch (error) {
    console.error(`${errorContext}: request threw`, error);
    toast.error(failureMessage);
    return null;
  }
}

export async function saveWorkout({
  persistMode,
  values,
  workoutId,
}: SaveWorkoutInput): Promise<SaveWorkoutResult> {
  if (persistMode === "create") {
    const response = await performSaveRequest(values, {
      url: "/api/workouts",
      method: "POST",
      failureMessage: "Failed to create workout",
      errorContext: "saveWorkout(create)",
    });

    if (!response) {
      return { ok: false };
    }

    try {
      const data = await parseJsonResponse(
        response,
        createWorkoutResponseSchema,
      );

      return {
        ok: true,
        workoutId: data.workoutId,
      };
    } catch (error) {
      console.error("saveWorkout(create): failed to parse response", error);
      toast.error("Failed to create workout");
      return { ok: false };
    }
  }

  if (workoutId == null) {
    throw new Error("saveWorkout requires workoutId in update mode");
  }

  const response = await performSaveRequest(values, {
    url: `/api/workouts/${workoutId}`,
    method: "PATCH",
    failureMessage: "Failed to save workout",
    errorContext: "saveWorkout(update)",
  });

  if (!response) {
    return { ok: false };
  }

  return {
    ok: true,
    workoutId,
  };
}
