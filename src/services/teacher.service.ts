import { TeacherRepository } from "@/repositories/teacher.repository";
import type { Teacher } from "@/types/academy";
import type { TeacherInput, TeacherUpdateInput } from "@/validators/academy";
import { HTTPException } from "hono/http-exception";

export class TeacherService {
  constructor(private readonly teacherRepo: TeacherRepository) {}

  async create(data: TeacherInput): Promise<Teacher> {
    return await this.teacherRepo.create(data);
  }

  async update(id: number, data: TeacherUpdateInput): Promise<Teacher> {
    const teacher = await this.teacherRepo.update(id, data);
    if (!teacher) {
      throw new HTTPException(404, { message: "Teacher not found" });
    }
    return teacher;
  }

  async delete(id: number): Promise<Teacher> {
    const teacher = await this.teacherRepo.delete(id);
    if (!teacher) {
      throw new HTTPException(404, { message: "Teacher not found" });
    }
    return teacher;
  }

  async findById(id: number): Promise<Teacher> {
    const teacher = await this.teacherRepo.findById(id);
    if (!teacher) {
      throw new HTTPException(404, { message: "Teacher not found" });
    }
    return teacher;
  }

  async findAll(): Promise<Teacher[]> {
    return await this.teacherRepo.findAll();
  }
}
