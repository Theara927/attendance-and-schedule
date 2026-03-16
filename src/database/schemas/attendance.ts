import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  uniqueIndex,
  date,
  text,
} from "drizzle-orm/pg-core";
import { attendanceStatusEnum } from "./enums";
import { courses, students, teachers } from "./academic";

export const attendanceRecords = pgTable(
  "attendance_records",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id),
    studentId: text("student_id")
      .notNull()
      .references(() => students.id),
    date: date("date").notNull(),
    status: attendanceStatusEnum("status").notNull().default("absent"),
    session: integer("session").notNull(),
    notes: varchar("notes", { length: 500 }),
    recordedBy: text("recorded_by").references(() => teachers.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("unique_attendance_record").on(
      table.courseId,
      table.studentId,
      table.date,
      table.session,
    ),
  ],
);
