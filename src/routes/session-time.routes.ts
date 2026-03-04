import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  sessionTimeSchema,
  sessionTimeUpdateSchema,
} from "@/validators/academy";

const router = new Hono();

router.get("/", async (c) => {
  const { sessionTimeService } = c.var.container;
  const sessionTimes = await sessionTimeService.findAll();
  return c.json(sessionTimes);
});

router.get("/:id", async (c) => {
  const { sessionTimeService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const sessionTime = await sessionTimeService.findById(id);
  return c.json(sessionTime);
});

router.post("/", zValidator("json", sessionTimeSchema), async (c) => {
  const { sessionTimeService } = c.var.container;
  const data = c.req.valid("json");
  const sessionTime = await sessionTimeService.create(data);
  return c.json(sessionTime);
});

router.put("/:id", zValidator("json", sessionTimeUpdateSchema), async (c) => {
  const { sessionTimeService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");
  const sessionTime = await sessionTimeService.update(id, data);
  return c.json(sessionTime);
});

router.delete("/:id", async (c) => {
  const { sessionTimeService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const sessionTime = await sessionTimeService.delete(id);
  return c.json(sessionTime);
});

export default router;
