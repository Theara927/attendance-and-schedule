import { FacultyRepository } from "@/repositories/faculty.repository";
import type { FacultyInput, FacultyUpdateInput } from "@/validators/academy";
import { HTTPException } from "hono/http-exception";

export class FacultyService {
  constructor(private readonly facultyRepo: FacultyRepository) {}

  async findAll() {
    return await this.facultyRepo.findAll();
  }

  async findById(id: number) {
    const faculty = await this.facultyRepo.findOne(id);
    if (!faculty) {
      throw new HTTPException(404, { message: "Faculty not found" });
    }
    return faculty;
  }

  async create(facultyData: FacultyInput) {
    return await this.facultyRepo.create(facultyData);
  }

  async update(id: number, facultyData: FacultyUpdateInput) {
    const faculty = await this.facultyRepo.update(id, facultyData);
    if (!faculty) {
      throw new HTTPException(404, { message: "Faculty not found" });
    }
    return faculty;
  }

  async delete(id: number) {
    const faculty = await this.facultyRepo.delete(id);
    if (!faculty) {
      throw new HTTPException(404, { message: "Faculty not found" });
    }
    return faculty;
  }
}
