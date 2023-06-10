// From https://github.com/joschan21/drizzle-planetscale-starter
import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  connectionString: process.env.DATABASE_URL,
  breakpoints: true,
} satisfies Config;
