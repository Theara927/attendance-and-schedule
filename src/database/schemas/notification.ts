import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { faculties, students } from "./academic";
import { notificationPriority } from "./enums";

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  message: text("message").notNull(),
  facultyId: integer("faculty_id")
    .references(() => faculties.id)
    .notNull(),
  targetDepartment: integer("target_department"),
  targetGeneration: integer("target_generation"),
  priority: notificationPriority("priority").default("normal"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notificationRecipients = pgTable("notification_recipients", {
  id: serial("id").primaryKey(),
  notificationId: integer("notification_id")
    .references(() => notifications.id)
    .notNull(),
  studentId: text("student_id")
    .references(() => students.id)
    .notNull(),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
