import type {
  AttendanceRecord,
  CourseAttendanceSummary,
} from "@/types/attendance";
import type {
  BulkAttendanceInput,
  MarkAttendanceInput,
} from "@/validators/attendance";
import type { AttendanceRepository } from "@/repositories/attendance.repository";
import { HTTPException } from "hono/http-exception";

export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async markBulkAttendance(
    input: BulkAttendanceInput,
  ): Promise<AttendanceRecord[]> {
    const records: MarkAttendanceInput[] = input.mark.map((mark) => ({
      courseId: input.courseId,
      studentId: mark.studentId,
      date: input.date,
      status: mark.status,
      session: input.session,
      notes: mark.notes,
      recordedBy: input.recordedBy,
    }));

    const existenceChecks = await Promise.all(
      records.map((record) =>
        this.attendanceRepository.findAttendanceByStudentIdCourseIdAndDate(
          record.studentId,
          record.courseId,
          new Date(record.date),
        ),
      ),
    );
    if (existenceChecks.some(Boolean)) {
      throw new HTTPException(409, { message: "Attendance already marked" });
    }

    return this.attendanceRepository.markAttendance(records);
  }

  async generateAttendanceReportForStudent(
    studentId: number,
  ): Promise<Record<string, CourseAttendanceSummary>> {
    const report =
      await this.attendanceRepository.getAttendanceByStudentId(studentId);

    const counts = report.reduce<
      Record<
        string,
        { late: number; absent: number; present: number; excused: number }
      >
    >((acc, row) => {
      const courseName = row.course.name;
      if (!acc[courseName]) {
        acc[courseName] = { late: 0, absent: 0, present: 0, excused: 0 };
      }
      switch (row.status) {
        case "absent":
          acc[courseName].absent++;
          break;
        case "present":
          acc[courseName].present++;
          break;
        case "late":
          acc[courseName].late++;
          break;
        case "excused":
          acc[courseName].excused++;
          break;
      }
      return acc;
    }, {});

    return Object.fromEntries(
      Object.entries(counts).map(([courseName, c]) => {
        const total = c.absent + c.present + c.late + c.excused;
        const absentPercentage = total > 0 ? (c.absent / total) * 100 : 0;
        const excusedPercentage = total > 0 ? (c.excused / total) * 100 : 0;
        return [
          courseName,
          {
            ...c,
            absentPercentage,
            excusedPercentage,
            absentAndExcusePercentage: absentPercentage + excusedPercentage,
          },
        ];
      }),
    );
  }

  async getAttendanceByStudentId(
    studentId: number,
  ): Promise<AttendanceRecord[]> {
    return this.attendanceRepository.getAttendanceByStudentId(studentId);
  }
}
