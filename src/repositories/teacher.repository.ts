import { type DrizzleDb } from "@/database";
import { teachers } from "@/database/schemas";
import type { Teacher } from "@/types/academy";
import type {
  TeacherInput,
  TeacherQueryInput,
  TeacherUpdateInput,
} from "@/validators/academy";
import { and, count, eq, ilike, SQL } from "drizzle-orm";

export class TeacherRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findAll(query: TeacherQueryInput): Promise<{
    data: Teacher[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { name, facultyId, academicLevelId, page, limit } = query;
    const conditions: SQL[] = [];

    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.min(100, Math.max(1, Math.floor(limit)));

    if (name?.trim()) conditions.push(ilike(teachers.name, `%${name.trim()}%`));
    if (facultyId) conditions.push(eq(teachers.facultyId, facultyId));
    if (academicLevelId)
      conditions.push(eq(teachers.academicLevelId, academicLevelId));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      this.db.query.teachers.findMany({
        where,
        limit: safeLimit,
        offset: (safePage - 1) * safeLimit,
      }),
      this.db.select({ total: count() }).from(teachers).where(where),
    ]);

    const total = countResult[0]?.total ?? 0;

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
    };
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
