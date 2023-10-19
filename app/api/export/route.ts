import * as xlsx from "xlsx";
import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { Workout } from "@/lib/types";
// Not sure if we want a get or post route
// Probably should be a get, we'll fetch all the data on the server

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
    console.log(data);
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);

    xlsx.utils.book_append_sheet(wb, ws, "Workout Data");

    xlsx.writeFile(wb, "text_file.xlsx");
  } else {
    console.log("no user found :(");
  }
  return new Response("Exporting data");
}
