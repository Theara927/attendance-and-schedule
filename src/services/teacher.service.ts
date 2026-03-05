import { TeacherRepository } from "@/repositories/teacher.repository";
import type { Teacher } from "@/types/academy";
import type { TeacherInput, TeacherUpdateInput } from "@/validators/academy";
import { HTTPException } from "hono/http-exception";

export class TeacherService {
  constructor(private readonly teacherRepo: TeacherRepository) {}

  async create(data: TeacherInput): Promise<Teacher> {
    return this.teacherRepo.create(data);
  }

  async update(id: number, data: TeacherUpdateInput): Promise<Teacher> {
    if (Object.keys(data).length === 0) {
      throw new HTTPException(400, {
        message: "Update requires at least one field",
      });
    }
    let update: Teacher | undefined;
    try {
      update = await this.teacherRepo.update(id, data);
    } catch (error) {
      throw new HTTPException(500, { message: "Failed to update teacher" });
    }
    if (!update) {
      throw new HTTPException(404, { message: "Teacher not found" });
    }
    return update;
  }

  async delete(id: number): Promise<Teacher> {
    const teacher = this.teacherRepo.delete(id);
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
    return this.teacherRepo.findAll();
  }
}
