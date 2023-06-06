import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { workouts } from "@/db/schema";

export async function POST(request: Request) {
  const body = await request.json();
  // TODO: Get user from clerk

  try {
    // Call DB
    const result = await db
      .insert(workouts)
      .values({ name: body.name, date: body.date });
    console.log("result", result);
    return new Response("Hello from api/workouts");
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
  }
}
