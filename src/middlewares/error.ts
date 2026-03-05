import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export async function errorHandler(c: Context, e: unknown) {
  if (e instanceof HTTPException) {
    return c.json({ message: e.message }, e.status);
  }

  console.error("Unhandled error:", e);
  return c.json({ message: "Internal Server Error" }, 500);
}
