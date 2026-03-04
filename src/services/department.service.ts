import { DepartmentRepository } from "@/repositories/department.repository";
import type { Department } from "@/types/academy";
import type {
  DepartmentInput,
  DepartmentUpdateInput,
} from "@/validators/academy";
import { HTTPException } from "hono/http-exception";

export class DepartmentService {
  constructor(private readonly departmentRepo: DepartmentRepository) {}

  async create(data: DepartmentInput): Promise<Department> {
    return await this.departmentRepo.create(data);
  }

  async update(id: number, data: DepartmentUpdateInput): Promise<Department> {
    const department = await this.departmentRepo.update(id, data);
    if (!department) {
      throw new HTTPException(404, { message: "Department not found" });
    }
    return department;
  }

  async delete(id: number): Promise<Department> {
    const department = await this.departmentRepo.delete(id);
    if (!department) {
      throw new HTTPException(404, { message: "Department not found" });
    }
    return department;
  }

  async findById(id: number): Promise<Department> {
    const department = await this.departmentRepo.findById(id);
    if (!department) {
      throw new HTTPException(404, { message: "Department not found" });
    }
    return department;
  }

  async findAll(): Promise<Department[]> {
    return await this.departmentRepo.findAll();
  }
}
