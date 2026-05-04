import * as z from "zod";

export const errorResponseSchema = z.object({
  error: z.string().optional(),
});

export async function parseJsonResponse<T>(
  response: Response,
  schema: z.ZodType<T>,
): Promise<T> {
  const data: unknown = await response.json();

  return schema.parse(data);
}
