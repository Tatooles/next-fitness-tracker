import { createPwaIconResponse } from "@/lib/pwa-icon";

export const runtime = "edge";

export async function GET() {
  return createPwaIconResponse(192);
}
