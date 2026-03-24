import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  studentQuerySchema,
  studentSchema,
  studentUpdateSchema,
} from "@/validators/academy";
import authentication from "@/middlewares/auth";

const router = new Hono();

router.get("/", zValidator("query", studentQuerySchema), async (c) => {
  const { studentService } = c.var.container;
  const query = c.req.valid("query");
  const students = await studentService.findAll(query);
  return c.json(students);
});

router.get("/:id", async (c) => {
  const { studentService } = c.var.container;
  const id = c.req.param("id");
  const student = await studentService.findById(id);
  return c.json(student);
});

router.get("/profile/me", authentication, async (c) => {
  const user = c.get("user");
  const { studentService } = c.var.container;
  const student = await studentService.findById(user.id);
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
  const id = c.req.param("id");
  const data = c.req.valid("json");
  const student = await studentService.update(id, data);
  return c.json(student);
});

router.delete("/:id", async (c) => {
  const { studentService } = c.var.container;
  const id = c.req.param("id");
  const student = await studentService.delete(id);
  return c.json(student);
});

router.get("/attendance", authentication, async (c) => {
  const user = c.get("user");
  const { attendanceService } = c.var.container;
  const records = await attendanceService.generateAttendanceReportForStudent(
    user.id,
  );
  return c.json(records);
});

router.get("/schedule/current-academic-year/:id", async (c) => {
  const { studentService } = c.var.container;
  const schedule =
    await studentService.findScheduleByStudentIdAndAcademicYearId(
      c.req.param("id"),
    );
  return c.json(schedule);
});

export default router;
