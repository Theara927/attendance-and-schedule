import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  academicYearSchema,
  academicYearUpdateSchema,
} from "@/validators/academy";

const router = new Hono();

router.get("/", async (c) => {
  const { academicYearService } = c.var.container;
  const academicYears = await academicYearService.findAll();
  return c.json(academicYears);
});

router.get("/:id", async (c) => {
  const { academicYearService } = c.var.container;
  const academicYear = await academicYearService.findById(
    Number(c.req.param("id")),
  );
  return c.json(academicYear);
});

router.post("/", zValidator("json", academicYearSchema), async (c) => {
  const { academicYearService } = c.var.container;
  const academicYear = await academicYearService.create(c.req.valid("json"));
  return c.json(academicYear);
});

router.put("/:id", zValidator("json", academicYearUpdateSchema), async (c) => {
  const { academicYearService } = c.var.container;
  const academicYear = await academicYearService.update(
    Number(c.req.param("id")),
    c.req.valid("json"),
  );
  return c.json(academicYear);
});

router.delete("/:id", async (c) => {
  const { academicYearService } = c.var.container;
  const academicYear = await academicYearService.delete(
    Number(c.req.param("id")),
  );
  return c.json(academicYear);
});

export default router;
