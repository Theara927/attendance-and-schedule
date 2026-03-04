import type { AttendanceRecord } from "@/types/attendance";
import type {
  BulkAttendanceInput,
  MarkAttendanceInput,
} from "@/validators/attendance";
import type { AttendanceRepository } from "@/repositories/attendance.repository";
import { HTTPException } from "hono/http-exception";

export class AttendanceService {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async markAttendance(data: MarkAttendanceInput): Promise<AttendanceRecord> {
    const records = await this.attendanceRepository.markAttendance([data]);
    if (!records || records.length === 0) {
      throw new HTTPException(500, { message: "Failed to mark attendance" });
    }
    return records[0]!;
  }

  async markBulkAttendance(
    datas: BulkAttendanceInput,
  ): Promise<AttendanceRecord[]> {
    const records: MarkAttendanceInput[] = datas.mark.map((mark) => ({
      courseId: datas.courseId,
      studentId: mark.studentId,
      date: datas.date,
      status: mark.status,
      session: datas.session,
      notes: mark.notes,
      recordedBy: datas.recordedBy,
    }));

    return await this.attendanceRepository.markAttendance(records);
  }

  async generateAttendanceReportForStudent(studentId: number) {
    const report =
      await this.attendanceRepository.getAttendanceByStudentId(studentId);
    const result = report.reduce<
      Record<
        string,
        {
          late: number;
          absent: number;
          present: number;
          excused: number;
          absentPercentage: number;
          excusedPercentage: number;
          absentAndExcusePercentage: number;
        }
      >
    >((acc: any, row: any) => {
      const courseName = row.course.name;
      if (!acc[courseName]) {
        acc[courseName] = {
          late: 0,
          absent: 0,
          present: 0,
          excused: 0,
          absentPercentage: 0,
          excusedPercentage: 0,
          absentAndExcusePercentage: 0,
        };
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

      const totalAbsentPercentage = (acc[courseName].absent / 30) * 100;
      const totalExcusedPercentage = (acc[courseName].excused / 30) * 100;
      const totalAbsentAndExcusedPercentage =
        totalAbsentPercentage + totalExcusedPercentage;

      acc[courseName].absentPercentage = totalAbsentPercentage;
      acc[courseName].excusedPercentage = totalExcusedPercentage;
      acc[courseName].absentAndExcusePercentage =
        totalAbsentAndExcusedPercentage;

      return acc;
    }, {});

    return result;
  }

  async getAttendanceByStudentId(studentId: number) {
    return await this.attendanceRepository.getAttendanceByStudentId(studentId);
  }
}
