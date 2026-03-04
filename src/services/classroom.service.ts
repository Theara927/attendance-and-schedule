import type { BuildingRepository } from "@/repositories/building.repository";
import type { ClassroomRepository } from "@/repositories/classroom.repository";
import type { Classroom } from "@/types/infrastructure";
import type { RedisCache } from "@/utils/redis";
import type {
  ClassroomInput,
  ClassroomUpdateInput,
} from "@/validators/infrastructure";
import { HTTPException } from "hono/http-exception";

export class ClassroomService {
  constructor(
    private readonly classroomRepository: ClassroomRepository,
    private readonly buildingRepository: BuildingRepository,
    private readonly cache: RedisCache<Classroom>,
  ) {}

  async findAll(): Promise<Classroom[]> {
    return this.classroomRepository.findAll();
  }

  async findById(id: number): Promise<Classroom> {
    const cacheKey = `classrooms:${id}`;
    const cached = await this.cache.get<Classroom>(cacheKey);
    if (cached) return cached;

    const classroom = await this.classroomRepository.findOne(id);
    if (!classroom) {
      await this.cache.del(cacheKey).catch(() => {});
      throw new HTTPException(404, { message: "Classroom not found" });
    }

    this.cache.set(cacheKey, classroom, 3600).catch(() => {});
    return classroom;
  }

  async create(data: ClassroomInput): Promise<Classroom> {
    const building = await this.buildingRepository.findOne(data.buildingId);
    if (!building) {
      throw new HTTPException(404, {
        message: `Building with ID ${data.buildingId} does not exist`,
      });
    }

    const existing = await this.classroomRepository.findByBuildingAndName(
      data.buildingId,
      data.name,
    );
    if (existing) {
      throw new HTTPException(409, {
        message: `Classroom "${data.name}" already exists in building "${building.name}"`,
      });
    }

    try {
      const created = await this.classroomRepository.create(data);
      this.cache.set(`classrooms:${created.id}`, created, 3600).catch(() => {});
      return created;
    } catch (error) {
      if (
        error instanceof Error &&
        /unique|duplicate|key.*violat/i.test(error.message)
      ) {
        throw new HTTPException(409, {
          message: `Classroom "${data.name}" already exists in building "${building.name}"`,
        });
      }
      throw new HTTPException(500, { message: "Failed to create classroom" });
    }
  }

  async update(id: number, data: ClassroomUpdateInput): Promise<Classroom> {
    if (Object.keys(data).length === 0) {
      throw new HTTPException(400, {
        message: "Update requires at least one field",
      });
    }

    if (data.buildingId !== undefined) {
      const newBuilding = await this.buildingRepository.findOne(
        data.buildingId,
      );
      if (!newBuilding) {
        throw new HTTPException(404, {
          message: `Target building with ID ${data.buildingId} does not exist`,
        });
      }
    }

    if (data.name !== undefined || data.buildingId !== undefined) {
      const current = await this.classroomRepository.findOne(id);
      if (!current)
        throw new HTTPException(404, { message: "Classroom not found" });

      const targetBuildingId = data.buildingId ?? current.buildingId;
      const targetName = data.name ?? current.name;

      const duplicate = await this.classroomRepository.findByBuildingAndName(
        targetBuildingId,
        targetName,
      );
      if (duplicate && duplicate.id !== id) {
        const building =
          await this.buildingRepository.findOne(targetBuildingId);
        throw new HTTPException(409, {
          message: `Classroom "${targetName}" already exists in building "${building?.name ?? `ID ${targetBuildingId}`}"`,
        });
      }
    }

    const updated = await this.classroomRepository.update(id, data);
    if (!updated)
      throw new HTTPException(404, { message: "Classroom not found" });
    this.cache.set(`classrooms:${id}`, updated, 3600).catch(() => {});
    return updated;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.classroomRepository.delete(id);
    this.cache.del(`classrooms:${id}`).catch(() => {});
    if (!deleted)
      throw new HTTPException(404, { message: "Classroom not found" });
  }
}
