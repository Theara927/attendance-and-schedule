import { type DrizzleDb } from "@/database";
import {
  academicYears,
  schedules,
  studentAcademicYears,
  students,
} from "@/database/schemas";
import type { Student } from "@/types/academy";
import type {
  StudentInput,
  StudentQueryInput,
  StudentUpdateInput,
} from "@/validators/academy";
import { and, count, eq, SQL } from "drizzle-orm";

export class StudentRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findAll(query: StudentQueryInput): Promise<{
    data: Student[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      facultyId,
      departmentId,
      academicLevelId,
      page = 1,
      limit = 10,
    } = query;

    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.min(100, Math.max(1, Math.floor(limit)));

    const conditions: SQL[] = [];
    if (facultyId !== undefined)
      conditions.push(eq(students.facultyId, facultyId));
    if (departmentId !== undefined)
      conditions.push(eq(students.departmentId, departmentId));
    if (academicLevelId !== undefined)
      conditions.push(eq(students.academicLevelId, academicLevelId));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      this.db.query.students.findMany({
        where,
        limit: safeLimit,
        offset: (safePage - 1) * safeLimit,
      }),
      this.db.select({ total: count() }).from(students).where(where),
    ]);

    const total = countResult[0]?.total ?? 0;

    return { data, total, page: safePage, limit: safeLimit };
  }

  async findById(id: string): Promise<Student | undefined> {
    return this.db.query.students.findFirst({
      where: eq(students.id, id),
    });
  }

  async create(data: StudentInput): Promise<Student> {
    const [student] = await this.db.insert(students).values(data).returning();
    if (!student) {
      throw new Error("Insert did not return a record");
    }
    return student;
  }

  async update(
    id: string,
    data: StudentUpdateInput,
  ): Promise<Student | undefined> {
    const [student] = await this.db
      .update(students)
      .set(data)
      .where(eq(students.id, id))
      .returning();
    return student;
  }

  async delete(id: string): Promise<Student | undefined> {
    const [deletedStudent] = await this.db
      .delete(students)
      .where(eq(students.id, id))
      .returning();
    return deletedStudent;
  }

  async findScheduleByStudentIdAndAcademicYearId(studentId: string) {
    const [student, currentYear] = await Promise.all([
      this.db.query.students.findFirst({
        where: eq(students.id, studentId),
        columns: { id: true, academicLevelId: true, departmentId: true },
      }),
      this.db.query.academicYears.findFirst({
        where: eq(academicYears.isCurrent, true),
        columns: { id: true },
      }),
    ]);

    if (!student || !currentYear) return null;
    if (!student.academicLevelId || !student.departmentId) return null;

    return this.db.query.studentAcademicYears.findFirst({
      where: and(
        eq(studentAcademicYears.studentId, studentId),
        eq(studentAcademicYears.academicYearId, currentYear.id),
      ),
      with: {
        academicYear: {
          with: {
            schedules: {
              where: (schedules, { and, eq }) =>
                and(
                  eq(schedules.academicLevelId, student.academicLevelId!),
                  eq(schedules.departmentId, student.departmentId!),
                ),
              with: {
                courses: {
                  with: {
                    teacher: true,
                    sessionTime: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
