import { type DrizzleDb } from "@/database";
import { classrooms } from "@/database/schemas";
import type { Classroom, ClassroomWithBuilding } from "@/types/infrastructure";
import type {
  ClassroomInput,
  ClassroomUpdateInput,
} from "@/validators/infrastructure";
import { and, eq } from "drizzle-orm";

export class ClassroomRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findOne(id: number): Promise<Classroom | undefined> {
    return this.db.query.classrooms.findFirst({ where: eq(classrooms.id, id) });
  }

  async findAll(): Promise<ClassroomWithBuilding[]> {
    return this.db.query.classrooms.findMany({
      with: {
        building: true,
      },
    });
  }

  async findByBuildingAndName(
    buildingId: number,
    name: string,
  ): Promise<Classroom | undefined> {
    return this.db.query.classrooms.findFirst({
      where: and(
        eq(classrooms.buildingId, buildingId),
        eq(classrooms.name, name),
      ),
    });
  }

  async create(data: ClassroomInput): Promise<Classroom> {
    const [newClassroom] = await this.db
      .insert(classrooms)
      .values(data)
      .returning();
    return newClassroom!;
  }

  async update(
    id: number,
    data: ClassroomUpdateInput,
  ): Promise<Classroom | undefined> {
    const [updated] = await this.db
      .update(classrooms)
      .set(data)
      .where(eq(classrooms.id, id))
      .returning();
    return updated;
  }

  async delete(id: number): Promise<Classroom> {
    const [deleted] = await this.db
      .delete(classrooms)
      .where(eq(classrooms.id, id))
      .returning();
    return deleted!;
  }
}
