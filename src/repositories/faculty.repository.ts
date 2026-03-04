import { type DrizzleDb } from "@/database";
import { faculties } from "@/database/schemas";
import type { Faculty } from "@/types/academy";
import type { FacultyInput, FacultyUpdateInput } from "@/validators/academy";
import { eq } from "drizzle-orm";

export class FacultyRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findOne(id: number): Promise<Faculty | null> {
    return this.db.query.faculties
      .findFirst({
        where: eq(faculties.id, id),
      })
      .then((result) => result || null);
  }

  async findAll(): Promise<Faculty[]> {
    return this.db.select().from(faculties);
  }

  async create(data: FacultyInput): Promise<Faculty | null> {
    const [created] = await this.db
      .insert(faculties)
      .values({
        name: data.name,
      })
      .returning();
    return created || null;
  }

  async update(id: number, data: FacultyUpdateInput): Promise<Faculty | null> {
    const [updated] = await this.db
      .update(faculties)
      .set({
        name: data.name,
        updatedAt: new Date(),
      })
      .where(eq(faculties.id, id))
      .returning();
    return updated || null;
  }

  async delete(id: number): Promise<Faculty | null> {
    const [deleted] = await this.db
      .delete(faculties)
      .where(eq(faculties.id, id))
      .returning();
    return deleted || null;
  }
}
