import { createMiddleware } from "hono/factory";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const authenticationMiddleware = createMiddleware(
  async (c: Context, next: Next) => {
    try {
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }
    }
  },
);
