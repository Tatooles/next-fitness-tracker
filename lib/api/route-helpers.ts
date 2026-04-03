import "server-only";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { workout } from "@/db/schema";

type RouteGuardFailure = {
  ok: false;
  response: NextResponse;
};

type RouteGuardSuccess<T> = {
  ok: true;
  value: T;
};

type RouteGuardResult<T> = RouteGuardFailure | RouteGuardSuccess<T>;

export const jsonError = (error: string, status: number) =>
  NextResponse.json({ error }, { status });

export async function requireUserId(): Promise<RouteGuardResult<string>> {
  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false,
      response: jsonError("Unauthorized", 401),
    };
  }

  return {
    ok: true,
    value: userId,
  };
}

export function parsePositiveIntParam(
  value: string,
  name = "id",
): RouteGuardResult<number> {
  if (!/^\d+$/.test(value)) {
    return {
      ok: false,
      response: jsonError(`Invalid ${name}`, 400),
    };
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isSafeInteger(parsedValue) || parsedValue <= 0) {
    return {
      ok: false,
      response: jsonError(`Invalid ${name}`, 400),
    };
  }

  return {
    ok: true,
    value: parsedValue,
  };
}

export async function requireOwnedWorkout(
  userId: string,
  workoutId: number,
): Promise<RouteGuardResult<{ id: number; userId: string | null }>> {
  const ownedWorkout = await db.query.workout.findFirst({
    columns: {
      id: true,
      userId: true,
    },
    where: and(eq(workout.id, workoutId), eq(workout.userId, userId)),
  });

  if (!ownedWorkout) {
    return {
      ok: false,
      response: jsonError("Workout not found", 404),
    };
  }

  return {
    ok: true,
    value: ownedWorkout,
  };
}

export async function parseJsonBody(
  request: Request,
): Promise<RouteGuardResult<unknown>> {
  try {
    return {
      ok: true,
      value: await request.json(),
    };
  } catch {
    return {
      ok: false,
      response: jsonError("Invalid JSON body", 400),
    };
  }
}
