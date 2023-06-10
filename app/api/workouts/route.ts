import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { workouts } from "@/db/schema";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    // This will likely end up being a pretty big query. Hopefully we don't have to insert each item indivivually
    // TODO: Likely going to iterate through the nested data and do an insert for each part
    const result = await db
      .insert(workouts)
      .values({ name: body.name, date: body.date, userId: body.userId });
    return new Response("Hello from api/workouts");
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
  }
}

export async function GET(request: Request) {
  try {
    const result = await db.select().from(workouts);
    return new Response(JSON.stringify({ workouts: result }));
  } catch (error) {
    console.log("An error ocurred!");
    if (error instanceof Error) console.log(error.message);
  }
}
