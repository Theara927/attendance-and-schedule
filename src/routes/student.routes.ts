import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { studentSchema, studentUpdateSchema } from "@/validators/academy";

const router = new Hono();

router.get("/", async (c) => {
  const { studentService } = c.var.container;
  const students = await studentService.findAll();
  return c.json(students);
});

router.get("/:id", async (c) => {
  const { studentService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const student = await studentService.findById(id);
  return c.json(student);
});

router.post("/", zValidator("json", studentSchema), async (c) => {
  const { studentService } = c.var.container;
  const data = c.req.valid("json");
  const student = await studentService.create(data);
  return c.json(student);
});

router.put("/:id", zValidator("json", studentUpdateSchema), async (c) => {
  const { studentService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");
  const student = await studentService.update(id, data);
  return c.json(student);
});

router.delete("/:id", async (c) => {
  const { studentService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const student = await studentService.delete(id);
  return c.json(student);
});

export default router;
