import type { AcademicLevelRepository } from "@/repositories/academic-level.repository";
import type { AcademicLevel } from "@/types/academy";
import type {
  AcademicLevelInput,
  AcademicLevelUpdateInput,
} from "@/validators/academy";
import { HTTPException } from "hono/http-exception";

export class AcademicLevelService {
  constructor(private readonly academicLevelRepo: AcademicLevelRepository) {}

  async create(data: AcademicLevelInput): Promise<AcademicLevel> {
    return await this.academicLevelRepo.create(data);
  }

  async update(
    id: number,
    data: AcademicLevelUpdateInput,
  ): Promise<AcademicLevel> {
    const academicLevel = await this.academicLevelRepo.update(id, data);
    if (!academicLevel) {
      throw new HTTPException(404, { message: "Academic level not found" });
    }
    return academicLevel;
  }

  async delete(id: number): Promise<AcademicLevel> {
    const academicLevel = await this.academicLevelRepo.delete(id);
    if (!academicLevel) {
      throw new HTTPException(404, { message: "Academic level not found" });
    }
    return academicLevel;
  }

  async findById(id: number): Promise<AcademicLevel> {
    const academicLevel = await this.academicLevelRepo.findById(id);
    if (!academicLevel) {
      throw new HTTPException(404, { message: "Academic level not found" });
    }
    return academicLevel;
  }

  async findAll(): Promise<AcademicLevel[]> {
    return await this.academicLevelRepo.findAll();
  }
}
