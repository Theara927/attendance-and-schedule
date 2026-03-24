import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  buildingQuerySchema,
  buildingSchema,
  buildingUpdateSchema,
} from "@/validators/infrastructure";

const router = new Hono();

router.get("/", zValidator("query", buildingQuerySchema), async (c) => {
  const { buildingService } = c.var.container;
  const query = c.req.valid("query");
  const buildings = await buildingService.findAll(query);
  return c.json(buildings);
});

router.get("/:id", async (c) => {
  const { buildingService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const building = await buildingService.findById(id);
  return c.json(building);
});

router.post("/", zValidator("json", buildingSchema), async (c) => {
  const { buildingService } = c.var.container;
  const buildingData = c.req.valid("json");
  const building = await buildingService.create(buildingData);
  return c.json(building);
});

router.put("/:id", zValidator("json", buildingUpdateSchema), async (c) => {
  const { buildingService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const buildingData = c.req.valid("json");
  const building = await buildingService.update(id, buildingData);
  return c.json(building);
});

router.delete("/:id", async (c) => {
  const { buildingService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  await buildingService.delete(id);
  return c.json({ message: "Building deleted successfully" });
});

export default router;
