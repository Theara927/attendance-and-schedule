import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { bulkAttendanceSchema } from "@/validators/attendance";
import { roleMiddleware } from "@/middlewares/roles";
import authentication from "@/middlewares/auth";

const router = new Hono();

router.post(
  "/bulk",
  authentication,
  roleMiddleware("teacher", "admin"),
  zValidator("json", bulkAttendanceSchema),
  async (c) => {
    const user = c.get("user");
    const { attendanceService } = c.var.container;
    const data = c.req.valid("json");
    const result = await attendanceService.markBulkAttendance({
      ...data,
      recordedBy: user.id,
    });
    return c.json(result);
  },
);

router.get(
  "/student/:id",
  authentication,
  roleMiddleware("teacher", "admin"),
  async (c) => {
    const { attendanceService } = c.var.container;
    const id = c.req.param("id");
    const records = await attendanceService.getAttendanceByStudentId(id);
    return c.json(records);
  },
);

export default router;
