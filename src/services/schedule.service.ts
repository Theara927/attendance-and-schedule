import { db } from "@/database";
import type { CourseRepository } from "@/repositories/course.repository";
import { ScheduleRepository } from "@/repositories/schedule.repository";
import type { Course, Schedule } from "@/types/academy";
import type {
  CourseInput,
  ScheduleInput,
  ScheduleUpdateInput,
  ScheduleWithCoursesInput,
} from "@/validators/academy";
import { HTTPException } from "hono/http-exception";
import { DatabaseError } from "pg";

export class ScheduleService {
  constructor(
    private readonly scheduleRepo: ScheduleRepository,
    private readonly courseRepo: CourseRepository,
  ) {}

  async createSchedule(
    data: ScheduleWithCoursesInput,
  ): Promise<{ schedule: Schedule; courses: Course[] }> {
    try {
      const { schedule: scheduleData, courses: courseDatas } = data;
      return await db.transaction(async (tx) => {
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
          tx,
        );

        if (existingSchedule) {
          throw new HTTPException(409, { message: "Schedule already exists" });
        }

        const schedule = await this.scheduleRepo.create(scheduleData, tx);
        if (!schedule) {
          throw new HTTPException(500, {
            message: "Failed to create schedule",
          });
        }

        const coursesWithSchedule = courseDatas.map((course: CourseInput) => ({
          ...course,
          scheduleId: schedule.id,
        }));

        const courses = await this.courseRepo.createMany(
          coursesWithSchedule,
          tx,
        );
        return { schedule, courses };
      });
    } catch (error) {
      console.log(error);
      if (error instanceof HTTPException) throw error;
      throw new HTTPException(500, { message: "Internal server error" });
    }
  }

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepo.findAll();
  }

  async findById(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepo.findById(id);
    if (!schedule) {
      throw new HTTPException(404, { message: "Schedule not found" });
    }
    return schedule;
  }

  async updateSchedule(
    id: number,
    scheduleData: ScheduleUpdateInput,
  ): Promise<Schedule> {
    if (Object.keys(scheduleData).length === 0) {
      throw new HTTPException(400, {
        message: "Update requires at least one field",
      });
    }

    let updated: Schedule | null;
    try {
      updated = await this.scheduleRepo.update(id, scheduleData);
    } catch (error) {
      if (error instanceof DatabaseError && error.code === "23505") {
        throw new HTTPException(409, { message: "Schedule already exists" });
      }
      throw new HTTPException(500, { message: "Failed to update schedule" });
    }

    if (!updated) {
      throw new HTTPException(404, { message: "Schedule not found" });
    }
    return updated;
  }

  async deleteSchedule(id: number): Promise<void> {
    const deleted = await this.scheduleRepo.delete(id);
    if (!deleted) {
      throw new HTTPException(404, { message: "Schedule not found" });
    }
  }
}
