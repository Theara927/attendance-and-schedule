import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  academicLevelSchema,
  academicLevelUpdateSchema,
} from "@/validators/academy";

const router = new Hono();

router.get("/", async (c) => {
  const { academicLevelService } = c.var.container;
  const levels = await academicLevelService.findAll();
  return c.json(levels);
});

router.get("/:id", async (c) => {
  const { academicLevelService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const level = await academicLevelService.findById(id);
  return c.json(level);
});

router.post("/", zValidator("json", academicLevelSchema), async (c) => {
  const { academicLevelService } = c.var.container;
  const data = c.req.valid("json");
  const level = await academicLevelService.create(data);
  return c.json(level);
});

router.put("/:id", zValidator("json", academicLevelUpdateSchema), async (c) => {
  const { academicLevelService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");
  const level = await academicLevelService.update(id, data);
  return c.json(level);
});

router.delete("/:id", async (c) => {
  const { academicLevelService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const level = await academicLevelService.delete(id);
  return c.json(level);
});

export default router;
