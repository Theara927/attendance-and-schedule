import { type DrizzleDb } from "@/database";
import { students } from "@/database/schemas";
import type { Student } from "@/types/academy";
import type { StudentInput, StudentUpdateInput } from "@/validators/academy";
import { eq } from "drizzle-orm";

export class StudentRepository {
  constructor(private readonly db: DrizzleDb) {}

  async findAll(): Promise<Student[]> {
    return await this.db.query.students.findMany();
  }

  async findById(id: number): Promise<Student | undefined> {
    return await this.db.query.students.findFirst({
      where: eq(students.id, id),
    });
  }

  async create(data: StudentInput): Promise<Student> {
    const [student] = await this.db.insert(students).values(data).returning();
    return student!;
  }

  async update(
    id: number,
    data: StudentUpdateInput,
  ): Promise<Student | undefined> {
    const [student] = await this.db
      .update(students)
      .set(data)
      .where(eq(students.id, id))
      .returning();
    return student;
  }

  async delete(id: number): Promise<Student> {
    const [deletedStudent] = await this.db
      .delete(students)
      .where(eq(students.id, id))
      .returning();

    return deletedStudent!;
  }
}
