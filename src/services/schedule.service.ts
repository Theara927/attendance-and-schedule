import { db } from "@/database";
import { schedules } from "@/database/schemas";
import type { CourseRepository } from "@/repositories/course.repository";
import { ScheduleRepository } from "@/repositories/schedule.repository";
import type { CourseInput, ScheduleInput } from "@/validators/academy";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class ScheduleService {
  constructor(
    private readonly scheduleRepo: ScheduleRepository,
    private readonly courseRepo: CourseRepository,
  ) {}

  async createSchedule(
    scheduleData: ScheduleInput,
    courseDatas: CourseInput[],
  ) {
    try {
      const result = await db.transaction(async (tx) => {
        const existingSchedule = await this.scheduleRepo.findByUniqueKey(
          {
            facultyId: scheduleData.facultyId,
            academicLevelId: scheduleData.academicLevelId,
            departmentId: scheduleData.departmentId,
            semester: scheduleData.semester,
            studyShift: scheduleData.studyShift,
            generation: scheduleData.generation,
            year: scheduleData.year,
          },
          tx as any,
        );

        if (existingSchedule) {
          throw new HTTPException(400, { message: "Schedule already exists" });
        }

        const schedule = await this.scheduleRepo.create(
          scheduleData,
          tx as any,
        );

        if (!schedule) {
          throw new HTTPException(400, { message: "Schedule not created" });
        }

        const courseWithSchedule = courseDatas.map((course: CourseInput) => ({
          ...course,
          scheduleId: schedule.id,
        }));

        const course = await this.courseRepo.createMany(
          courseWithSchedule,
          tx as any,
        );
        return { schedule, course };
      });
      return result;
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(500, { message: "Internal server error" });
    }
  }

  async findAll() {
    return await this.scheduleRepo.findAll();
  }

  async findById(id: number) {
    const schedule = await this.scheduleRepo.findById(id);
    if (!schedule) {
      throw new HTTPException(404, { message: "Schedule not found" });
    }
    return schedule;
  }

  async updateSchedule(id: number, scheduleData: any) {
    const result = await this.scheduleRepo.update(id, scheduleData);
    if (!result) {
      throw new HTTPException(404, { message: "Schedule not found" });
    }
    return result;
  }

  async deleteSchedule(id: number) {
    const schedule = await this.scheduleRepo.findById(id);
    if (!schedule) {
      throw new HTTPException(404, { message: "Schedule not found" });
    }
    return await this.scheduleRepo.delete(id);
  }
}
