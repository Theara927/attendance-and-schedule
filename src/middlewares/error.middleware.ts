import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error: unknown) {
    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status);
    }
    if (error instanceof Error) {
      console.error("Unhandled error:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
    console.error("Unhandled error:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}
