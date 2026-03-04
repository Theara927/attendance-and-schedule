import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { teacherSchema, teacherUpdateSchema } from "@/validators/academy";

const router = new Hono();

router.get("/", async (c) => {
  const { teacherService } = c.var.container;
  const teachers = await teacherService.findAll();
  return c.json(teachers);
});

router.get("/:id", async (c) => {
  const { teacherService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const teacher = await teacherService.findById(id);
  return c.json(teacher);
});

router.post("/", zValidator("json", teacherSchema), async (c) => {
  const { teacherService } = c.var.container;
  const data = c.req.valid("json");
  const teacher = await teacherService.create(data);
  return c.json(teacher);
});

router.put("/:id", zValidator("json", teacherUpdateSchema), async (c) => {
  const { teacherService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");
  const teacher = await teacherService.update(id, data);
  return c.json(teacher);
});

router.delete("/:id", async (c) => {
  const { teacherService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const teacher = await teacherService.delete(id);
  return c.json(teacher);
});

export default router;
