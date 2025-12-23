import * as xlsx from "xlsx";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { Workout } from "@/lib/types";
import { NextRequest } from "next/server";
import { BookType } from "xlsx";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileType = searchParams.get("fileType") as BookType;

  const { userId } = await auth();
  if (!userId) {
    console.log("User not found");
    return Response.error();
  }

  const data: Workout[] = await db.query.workout.findMany({
    where: (workout, { eq }) => eq(workout.userId, userId),
    with: {
      exercises: {
        with: {
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.id)],
          },
        },
      },
    },
  });
  let input = [] as string[][];
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

  const excelBuffer = xlsx.write(wb, { bookType: fileType, type: "buffer" });

  let mimeType = "application/json";

  switch (fileType) {
    case "xlsx":
      mimeType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      break;
    case "csv":
      mimeType = "text/csv";
  }

  const headers = new Headers();
  headers.append("Content-Type", mimeType);
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
