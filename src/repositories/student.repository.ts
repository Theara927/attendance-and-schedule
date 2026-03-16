import { type DrizzleDb } from "@/database";
import { students } from "@/database/schemas";
import type { Student } from "@/types/academy";
import type { StudentInput, StudentUpdateInput } from "@/validators/academy";
import { and, eq, SQL } from "drizzle-orm";

export class StudentRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findAll(): Promise<Student[]> {
    return this.db.query.students.findMany();
  }

  async findByFilter(filter: {
    facultyId?: number;
    departmentId?: number;
    generation?: number;
  }): Promise<Student[]> {
    const conditions = [
      filter.facultyId !== undefined
        ? eq(students.facultyId, filter.facultyId)
        : undefined,
      filter.departmentId !== undefined
        ? eq(students.departmentId, filter.departmentId)
        : undefined,
      filter.generation !== undefined
        ? eq(students.generation, filter.generation)
        : undefined,
    ].filter(Boolean) as SQL[];

    return this.db.query.students.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
    });
  }

  async findById(id: string): Promise<Student | undefined> {
    return this.db.query.students.findFirst({
      where: eq(students.id, id),
    });
  }

  async create(data: StudentInput): Promise<Student> {
    const [student] = await this.db.insert(students).values(data).returning();
    if (!student) {
      throw new Error("Insert did not return a record");
    }
    return student;
  }

  async update(
    id: string,
    data: StudentUpdateInput,
  ): Promise<Student | undefined> {
    const [student] = await this.db
      .update(students)
      .set(data)
      .where(eq(students.id, id))
      .returning();
    return student;
  }

  async delete(id: string): Promise<Student | undefined> {
    const [deletedStudent] = await this.db
      .delete(students)
      .where(eq(students.id, id))
      .returning();
    return deletedStudent;
  }
}
