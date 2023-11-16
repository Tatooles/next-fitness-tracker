import * as xlsx from "xlsx";
import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { Workout } from "@/lib/types";

export async function GET(request: Request) {
  const userId = auth().userId;
  console.log(userId);
  if (userId) {
    const data: Workout[] = await db.query.workouts.findMany({
      where: (workouts, { eq }) => eq(workouts.userId, userId),
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

    // Can choose excel or CSV here
    const excelBuffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

    const headers = new Headers();
    headers.append(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    headers.append(
      "Content-Disposition",
      "attachment; filename=user_data.xlsx"
    );

    const response = new Response(excelBuffer, {
      status: 200,
      headers: headers,
    });

    return response;
  } else {
    console.log("no user found :(");
  }
  return new Response("Exporting data");
}
