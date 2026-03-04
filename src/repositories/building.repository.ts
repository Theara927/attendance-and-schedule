import { type DrizzleDb } from "@/database";
import { buildings } from "@/database/schemas";
import type { Building } from "@/types/infrastructure";
import type {
  BuildingInput,
  BuildingUpdateInput,
} from "@/validators/infrastructure";
import { eq } from "drizzle-orm";

export class BuildingRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findOne(id: number): Promise<Building | undefined> {
    return this.db.query.buildings.findFirst({ where: eq(buildings.id, id) });
  }

  async findByName(name: string): Promise<Building | undefined> {
    return this.db.query.buildings.findFirst({
      where: eq(buildings.name, name),
    });
  }

  async findAll(): Promise<Building[]> {
    return this.db.query.buildings.findMany();
  }

  async create(data: BuildingInput): Promise<Building> {
    const [newBuilding] = await this.db
      .insert(buildings)
      .values(data)
      .returning();
    return newBuilding!;
  }

  async update(
    id: number,
    data: BuildingUpdateInput,
  ): Promise<Building | undefined> {
    const [updated] = await this.db
      .update(buildings)
      .set(data)
      .where(eq(buildings.id, id))
      .returning();
    return updated;
  }

  async delete(id: number): Promise<Building> {
    const [deleted] = await this.db
      .delete(buildings)
      .where(eq(buildings.id, id))
      .returning();
    return deleted!;
  }
}
