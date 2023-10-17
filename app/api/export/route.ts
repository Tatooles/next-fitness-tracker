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
  } else {
    console.log("no user found :(");
  }
  return new Response("Exporting data");
}
