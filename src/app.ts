import { Hono } from "hono";
import { logger } from "hono/logger";
import { errorHandler } from "./middlewares/error.middleware";
import { diMiddleware } from "./middlewares/di.middleware";
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

const app = new Hono();

app.use("*", logger());
app.use("*", diMiddleware);
app.use("*", errorHandler);

app.get("/", (c) => c.text("Hello, Hono!"));
app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/buildings", buildingRoutes);
app.route("/classrooms", classroomRoutes);
app.route("/academic-levels", academicLevelRoutes);
app.route("/attendance", attendanceRoutes);
app.route("/departments", departmentRoutes);
app.route("/faculties", facultyRoutes);
app.route("/schedules", scheduleRoutes);
app.route("/session-times", sessionTimeRoutes);
app.route("/students", studentRoutes);
app.route("/teachers", teacherRoutes);
app.route("/translations", translationRoutes);
app.route("/notifications", notificationRoutes);

app.notFound((c) => c.json({ message: "Route not found" }, 404));

export default app;
