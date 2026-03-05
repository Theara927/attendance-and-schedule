import { attendanceRecords } from "@/database/schemas";

export type AttendanceRecord = typeof attendanceRecords.$inferSelect;

export interface CourseAttendanceSummary {
  late: number;
  absent: number;
  present: number;
  excused: number;
  absentPercentage: number;
  excusedPercentage: number;
  absentAndExcusePercentage: number;
}
