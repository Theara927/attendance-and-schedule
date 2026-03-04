import type { StudentRepository } from "@/repositories/student.repository";
import type { Student } from "@/types/academy";
import type { StudentInput, StudentUpdateInput } from "@/validators/academy";
import { HTTPException } from "hono/http-exception";

export class StudentService {
  constructor(private readonly studentRepo: StudentRepository) {}

  async create(data: StudentInput): Promise<Student> {
    return await this.studentRepo.create(data);
  }

  async update(id: number, data: StudentUpdateInput): Promise<Student> {
    const student = await this.studentRepo.update(id, data);
    if (!student) {
      throw new HTTPException(404, { message: "Student not found" });
    }
    return student;
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
    return await this.studentRepo.findAll();
  }
}
