import { env } from "@/config/environment";
import type { Config } from "drizzle-kit";

export default {
  out: "./src/infrastructure/migrations",
  schema: "./src/infrastructure/database/models",
  dialect: "postgresql",
  dbCredentials: {
    url: env?.DATABASE_URL!,
  },
} satisfies Config;
