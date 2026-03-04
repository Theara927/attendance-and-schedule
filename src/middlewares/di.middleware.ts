import { createMiddleware } from "hono/factory";
import { container, type ICradle } from "@/lib/container";

declare module "hono" {
  interface ContextVariableMap {
    container: ICradle;
  }
}

export const diMiddleware = createMiddleware(async (c, next) => {
  c.set("container", container.cradle);
  await next();
});
