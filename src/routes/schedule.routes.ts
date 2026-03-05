import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  courseSchema,
  scheduleSchema,
  scheduleUpdateSchema,
  scheduleWithCoursesSchema,
} from "@/validators/academy";

const router = new Hono();

router.get("/", async (c) => {
  const { scheduleService } = c.var.container;
  const schedules = await scheduleService.findAll();
  return c.json(schedules);
});

router.get("/:id", async (c) => {
  const { scheduleService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const schedule = await scheduleService.findById(id);
  return c.json(schedule);
});

router.post("/", zValidator("json", scheduleWithCoursesSchema), async (c) => {
  const { scheduleService } = c.var.container;
  const data = c.req.valid("json");
  const result = await scheduleService.createSchedule(data);
  return c.json(result);
});

router.put("/:id", zValidator("json", scheduleUpdateSchema), async (c) => {
  const { scheduleService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");
  const schedule = await scheduleService.updateSchedule(id, data);
  return c.json(schedule);
});

router.delete("/:id", async (c) => {
  const { scheduleService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const schedule = await scheduleService.deleteSchedule(id);
  return c.json(schedule);
});

export default router;
