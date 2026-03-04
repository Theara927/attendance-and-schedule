import type { BuildingRepository } from "@/repositories/building.repository";
import type { Building } from "@/types/infrastructure";
import { RedisCache } from "@/utils/redis";
import type {
  BuildingInput,
  BuildingUpdateInput,
} from "@/validators/infrastructure";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";

export class BuildingService {
  constructor(
    private readonly buildingRepository: BuildingRepository,
    private readonly cache: RedisCache<Building>,
  ) {}

  async findAll(): Promise<Building[]> {
    return this.buildingRepository.findAll();
  }

  async findById(id: number): Promise<Building> {
    const cacheKey = `buildings:${id}`;
    const cached = await this.cache.get<Building>(cacheKey);
    if (cached) return cached;

    const building = await this.buildingRepository.findOne(id);
    if (!building) {
      await this.cache.del(cacheKey).catch(() => {});
      throw new HTTPException(404, { message: "Building not found" });
    }

    this.cache.set(cacheKey, building, 3600).catch(() => {});
    return building;
  }

  async create(data: BuildingInput): Promise<Building> {
    const existing = await this.buildingRepository.findByName(data.name);
    if (existing) {
      throw new HTTPException(409, {
        message: `Building "${data.name}" already exists`,
      });
    }

    try {
      const building = await this.buildingRepository.create(data);
      this.cache
        .set(`buildings:${building.id}`, building, 3600)
        .catch(() => {});
      return building;
    } catch (error) {
      if (error instanceof DatabaseError && error.code === "23505") {
        throw new HTTPException(409, {
          message: `Building "${data.name}" already exists`,
        });
      }
      throw new HTTPException(500, { message: "Failed to create building" });
    }
  }

  async update(id: number, data: BuildingUpdateInput): Promise<Building> {
    if (Object.keys(data).length === 0) {
      throw new HTTPException(400, {
        message: "Update requires at least one field",
      });
    }

    if ("name" in data && data.name) {
      const existing = await this.buildingRepository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new HTTPException(409, {
          message: `Building name "${data.name}" is already in use`,
        });
      }
    }

    try {
      const updated = await this.buildingRepository.update(id, data);
      if (!updated) {
        throw new HTTPException(404, { message: "Building not found" });
      }

      this.cache.set(`buildings:${id}`, updated, 3600).catch(() => {});
      return updated;
    } catch (error) {
      if (error instanceof DatabaseError && error.code === "23505") {
        throw new HTTPException(409, {
          message: `Building name "${data.name}" is already in use`,
        });
      }
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.buildingRepository.delete(id);
    this.cache.del(`buildings:${id}`).catch(() => {});
    if (!deleted) {
      throw new HTTPException(404, { message: "Building not found" });
    }
  }
}
