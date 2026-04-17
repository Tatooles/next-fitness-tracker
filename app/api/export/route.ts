import * as xlsx from "xlsx";
import { db } from "@/db/drizzle";
import { Workout } from "@/lib/types";
import { NextRequest } from "next/server";
import { jsonError, requireUserId } from "@/lib/api/route-helpers";

const EXPORT_FORMATS = {
  xlsx: {
    bookType: "xlsx" as const,
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  csv: {
    bookType: "csv" as const,
    mimeType: "text/csv",
  },
};

type SupportedExportType = keyof typeof EXPORT_FORMATS;

function isSupportedExportType(
  fileType: string | null,
): fileType is SupportedExportType {
  return fileType !== null && Object.hasOwn(EXPORT_FORMATS, fileType);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileType = searchParams.get("fileType");

  const userIdResult = await requireUserId();
  if (!userIdResult.ok) {
    return userIdResult.response;
  }

  const userId = userIdResult.value;

  if (!isSupportedExportType(fileType)) {
    return jsonError("Unsupported fileType", 400);
  }

  const data: Workout[] = await db.query.workout.findMany({
    where: (workout, { eq }) => eq(workout.userId, userId),
    with: {
      exercises: {
        orderBy: (exercises, { asc }) => [asc(exercises.id)],
        with: {
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.id)],
          },
        },
      },
    },
  });
  const input = [] as string[][];
  for (const workout of data) {
    input.push([workout.name]);
    for (const exercise of workout.exercises) {
      input.push([exercise.name]);
      for (const set of exercise.sets) {
        input.push([set.reps, set.weight]);
      }
      input.push([exercise.notes]);
      input.push([]);
    }
    input.push([]);
    input.push([]);
  }
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet(input);

  xlsx.utils.book_append_sheet(wb, ws, "Workout Data");

  const exportFormat = EXPORT_FORMATS[fileType];
  const excelBuffer = xlsx.write(wb, {
    bookType: exportFormat.bookType,
    type: "buffer",
  });

  const headers = new Headers();
  headers.append("Content-Type", exportFormat.mimeType);
  headers.append(
    "Content-Disposition",
    `attachment; filename=user_data.${fileType}`,
  );

  const response = new Response(excelBuffer, {
    status: 200,
    headers: headers,
  });

  return response;
}
