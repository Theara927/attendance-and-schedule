import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { bulkAttendanceSchema } from "@/validators/attendance";

const router = new Hono();

router.post("/bulk", zValidator("json", bulkAttendanceSchema), async (c) => {
  const { attendanceService } = c.var.container;
  const data = c.req.valid("json");
  const result = await attendanceService.markBulkAttendance(data);
  return c.json(result);
});

router.get("/student/:id", async (c) => {
  const { attendanceService } = c.var.container;
  const id = parseInt(c.req.param("id"));
  const records = await attendanceService.getAttendanceByStudentId(id);
  return c.json(records);
});

export default router;
