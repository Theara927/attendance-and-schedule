import { type DrizzleDb } from "@/database";
import { teachers } from "@/database/schemas";
import type { Teacher } from "@/types/academy";
import type { TeacherInput, TeacherUpdateInput } from "@/validators/academy";
import { eq } from "drizzle-orm";

export class TeacherRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findAll(): Promise<Teacher[]> {
    return await this.db.query.teachers.findMany();
  }

  async findById(id: string): Promise<Teacher | undefined> {
    return await this.db.query.teachers.findFirst({
      where: eq(teachers.id, id),
    });
  }

  async create(data: TeacherInput): Promise<Teacher> {
    const [teacher] = await this.db.insert(teachers).values(data).returning();
    return teacher!;
  }

  async update(
    id: string,
    data: TeacherUpdateInput,
  ): Promise<Teacher | undefined> {
    const [teacher] = await this.db
      .update(teachers)
      .set(data)
      .where(eq(teachers.id, id))
      .returning();
    return teacher;
  }

  async delete(id: string): Promise<Teacher> {
    const [deleted] = await this.db
      .delete(teachers)
      .where(eq(teachers.id, id))
      .returning();
    return deleted!;
  }
}
