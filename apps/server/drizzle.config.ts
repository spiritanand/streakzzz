import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    host: "localhost",
    user: "root",
    password: "adminroot",
    database: "streakzzz",
  },
} satisfies Config;
