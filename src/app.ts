import { Hono } from "hono";
import { logger } from "hono/logger";
import { diMiddleware } from "./middlewares/di";
import buildingRoutes from "./routes/building.routes";
import classroomRoutes from "./routes/classroom.routes";
import academicLevelRoutes from "./routes/academic-level.routes";
import attendanceRoutes from "./routes/attendance.routes";
import departmentRoutes from "./routes/department.routes";
import facultyRoutes from "./routes/faculty.routes";
import scheduleRoutes from "./routes/schedule.routes";
import sessionTimeRoutes from "./routes/session-time.routes";
import studentRoutes from "./routes/student.routes";
import teacherRoutes from "./routes/teacher.routes";
import translationRoutes from "./routes/translation.routes";
import notificationRoutes from "./routes/notification.routes";
import authRoutes from "./routes/auth.routes";
import academicYearRoutes from "./routes/academic-year.routes";
import { auth } from "./lib/auth";
import { errorHandler } from "./middlewares/error";

const app = new Hono();

app.use("*", logger());
app.use("*", diMiddleware);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/health", (c) =>
  c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  }),
);

app.notFound((c) => c.json({ message: "Route not found" }, 404));

app.route("/api/buildings", buildingRoutes);
app.route("/api/classrooms", classroomRoutes);
app.route("/api/academic-levels", academicLevelRoutes);
app.route("/api/attendance", attendanceRoutes);
app.route("/api/departments", departmentRoutes);
app.route("/api/faculties", facultyRoutes);
app.route("/api/schedules", scheduleRoutes);
app.route("/api/session-times", sessionTimeRoutes);
app.route("/api/students", studentRoutes);
app.route("/api/teachers", teacherRoutes);
app.route("/api/translations", translationRoutes);
app.route("/api/notifications", notificationRoutes);
app.route("/api/authentications", authRoutes);
app.route("/api/academic-years", academicYearRoutes);

app.onError((e, c) => errorHandler(c, e));

export default app;
