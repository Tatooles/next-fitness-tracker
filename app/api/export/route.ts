import * as xlsx from "xlsx";
// Not sure if we want a get or post route
// Probably should be a get, we'll fetch all the data on the server

export async function GET(request: Request) {
  // TODO: Can just get id in here, don't event need to pass it from client
  return new Response("Exporting data");
}
