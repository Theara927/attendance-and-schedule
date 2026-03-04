import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { departmentSchema, departmentUpdateSchema } from "@/validators/academy";

const router = new Hono();

router.get("/", async (c) => {
  const { departmentService } = c.var.container;
  const departments = await departmentService.findAll();
  return c.json(departments);
});

router.get("/:id", async (c) => {
  const { departmentService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const department = await departmentService.findById(id);
  return c.json(department);
});

router.post("/", zValidator("json", departmentSchema), async (c) => {
  const { departmentService } = c.var.container;
  const data = c.req.valid("json");
  const department = await departmentService.create(data);
  return c.json(department);
});

router.put("/:id", zValidator("json", departmentUpdateSchema), async (c) => {
  const { departmentService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");
  const department = await departmentService.update(id, data);
  return c.json(department);
});

router.delete("/:id", async (c) => {
  const { departmentService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const department = await departmentService.delete(id);
  return c.json(department);
});

export default router;
