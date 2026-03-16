import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { studentSchema, studentUpdateSchema } from "@/validators/academy";
import authentication from "@/middlewares/auth";
import { roleMiddleware } from "@/middlewares/roles";

const router = new Hono();

router.get("/", authentication, roleMiddleware("admin"), async (c) => {
  const { studentService } = c.var.container;
  const students = await studentService.findAll();
  return c.json(students);
});

router.get("/:id", authentication, roleMiddleware("admin"), async (c) => {
  const { studentService } = c.var.container;
  const id = c.req.param("id");
  const student = await studentService.findById(id);
  return c.json(student);
});

router.get("/me", authentication, async (c) => {
  const user = c.get("user");
  const { studentService } = c.var.container;
  const student = await studentService.findById(user.id);
  return c.json(student);
});

router.post(
  "/",
  authentication,
  roleMiddleware("admin"),
  zValidator("json", studentSchema),
  async (c) => {
    const { studentService } = c.var.container;
    const data = c.req.valid("json");
    const student = await studentService.create(data);
    return c.json(student);
  },
);

router.put(
  "/:id",
  authentication,
  roleMiddleware("admin"),
  zValidator("json", studentUpdateSchema),
  async (c) => {
    const { studentService } = c.var.container;
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const student = await studentService.update(id, data);
    return c.json(student);
  },
);

router.delete("/:id", authentication, roleMiddleware("admin"), async (c) => {
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

export default router;
