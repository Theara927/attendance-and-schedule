import { type DrizzleDb } from "@/database";
import { attendanceRecords } from "@/database/schemas";
import type { AttendanceRecord } from "@/types/attendance";
import type {
  BulkAttendanceInput,
  MarkAttendanceInput,
} from "@/validators/attendance";
import { and, eq } from "drizzle-orm";

export class AttendanceRepository {
  constructor(private readonly db: DrizzleDb) {}

  async markAttendance(
    datas: MarkAttendanceInput[],
  ): Promise<AttendanceRecord[]> {
    const attendance = await this.db
      .insert(attendanceRecords)
      .values(datas)
      .returning();
    return attendance;
  }

  async getAttendanceByStudentId(studentId: number) {
    return await this.db.query.attendanceRecords.findMany({
      where: eq(attendanceRecords.studentId, studentId),
      with: {
        course: true,
      },
    });
  }

  async findAttendanceByStudentIdCourseIdAndDate(
    studentId: number,
    courseId: number,
    date: Date,
  ) {
    return await this.db.query.attendanceRecords.findFirst({
      where: and(
        eq(attendanceRecords.studentId, studentId),
        eq(attendanceRecords.courseId, courseId),
        eq(attendanceRecords.date, date.toDateString()),
      ),
    });
  }
}
