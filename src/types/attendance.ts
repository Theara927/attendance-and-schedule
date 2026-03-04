import { attendanceRecords } from "@/database/schemas";

export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
