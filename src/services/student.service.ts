import type { StudentRepository } from "@/repositories/student.repository";
import type { Student } from "@/types/academy";
import type {
  StudentInput,
  StudentQueryInput,
  StudentUpdateInput,
} from "@/validators/academy";
import { HTTPException } from "hono/http-exception";

export class StudentService {
  constructor(private readonly studentRepo: StudentRepository) {}

  async create(data: StudentInput): Promise<Student> {
    return this.studentRepo.create(data);
  }

  async update(id: string, data: StudentUpdateInput): Promise<Student> {
    if (Object.keys(data).length === 0) {
      throw new HTTPException(400, {
        message: "Update requires at least one field",
      });
    }
    let update: Student | undefined;
    try {
      update = await this.studentRepo.update(id, data);
    } catch (error) {
      throw new HTTPException(500, { message: "Failed to update student" });
    }
    if (!update) {
      throw new HTTPException(404, { message: "Student not found" });
    }
    return update;
  }

  async delete(id: string): Promise<Student> {
    const student = await this.studentRepo.delete(id);
    if (!student) {
      throw new HTTPException(404, { message: "Student not found" });
    }
    return student;
  }

  async findById(id: string): Promise<Student> {
    const student = await this.studentRepo.findById(id);
    if (!student) {
      throw new HTTPException(404, { message: "Student not found" });
    }
    return student;
  }

  async findAll(query: StudentQueryInput): Promise<{
    data: Student[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { facultyId, departmentId, academicLevelId, page, limit } = query;
    if (!facultyId || !departmentId || !academicLevelId) {
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      };
    }
    return this.studentRepo.findAll(query);
  }

  async findScheduleByStudentIdAndAcademicYearId(studentId: string) {
    const result =
      await this.studentRepo.findScheduleByStudentIdAndAcademicYearId(
        studentId,
      );
    if (!result) {
      throw new HTTPException(404, { message: "Student not found" });
    }
    return result;
  }
}
