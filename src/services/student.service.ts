import type { StudentRepository } from "@/repositories/student.repository";
import type { Student } from "@/types/academy";
import type { StudentInput, StudentUpdateInput } from "@/validators/academy";
import { HTTPException } from "hono/http-exception";

export class StudentService {
  constructor(private readonly studentRepo: StudentRepository) {}

  async create(data: StudentInput): Promise<Student> {
    return this.studentRepo.create(data);
  }

  async update(id: number, data: StudentUpdateInput): Promise<Student> {
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

  async delete(id: number): Promise<Student> {
    const student = await this.studentRepo.delete(id);
    if (!student) {
      throw new HTTPException(404, { message: "Student not found" });
    }
    return student;
  }

  async findById(id: number): Promise<Student> {
    const student = await this.studentRepo.findById(id);
    if (!student) {
      throw new HTTPException(404, { message: "Student not found" });
    }
    return student;
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepo.findAll();
  }
}
