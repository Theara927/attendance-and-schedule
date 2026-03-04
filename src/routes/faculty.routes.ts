import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { facultySchema, facultyUpdateSchema } from "@/validators/academy";

const router = new Hono();

router.get("/", async (c) => {
  const { facultyService } = c.var.container;
  const faculties = await facultyService.findAll();
  return c.json(faculties);
});

router.get("/:id", async (c) => {
  const { facultyService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const faculty = await facultyService.findById(id);
  return c.json(faculty);
});

router.post("/", zValidator("json", facultySchema), async (c) => {
  const { facultyService } = c.var.container;
  const data = c.req.valid("json");
  const faculty = await facultyService.create(data);
  return c.json(faculty);
});

router.put("/:id", zValidator("json", facultyUpdateSchema), async (c) => {
  const { facultyService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");
  const faculty = await facultyService.update(id, data);
  return c.json(faculty);
});

router.delete("/:id", async (c) => {
  const { facultyService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const faculty = await facultyService.delete(id);
  return c.json(faculty);
});

export default router;
