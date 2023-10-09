import * as xlsx from "xlsx";
// Not sure if we want a get or post route
// Probably should be a get, we'll fetch all the data on the server

export async function GET(request: Request) {
  // Want to have the userid and start and end dates as params
  return new Response("Exporting data");
}
