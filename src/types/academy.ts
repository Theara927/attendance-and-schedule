import {
  academicLevels,
  academicYears,
  courses,
  departments,
  faculties,
  schedules,
  sessionTimes,
  students,
  teachers,
} from "@/database/schemas";
import type { Building, Classroom } from "./infrastructure";

/**
 * Student Type
 */
export type Student = Omit<
  typeof students.$inferSelect,
  "createdAt" | "updatedAt"
>;

/**
 * Teacher Type
 */
export type Teacher = typeof teachers.$inferSelect;

/**
 * Faculty Type
 */
export type Faculty = typeof faculties.$inferSelect;

/**
 * Academic Level Type
 */
export type AcademicLevel = typeof academicLevels.$inferSelect;

/**
 * Department Type
 */
export type Department = typeof departments.$inferSelect;

/**
 * Course Type
 */
export type Course = typeof courses.$inferSelect;

/**
 * Session Type
 */
export type SessionTime = typeof sessionTimes.$inferSelect;

/**
 * Schedule Types
 */
export type Schedule = typeof schedules.$inferSelect;

export type ScheduleByAcademicIsCurrent = Pick<
  Schedule,
  "generation" | "semester" | "semesterStart" | "semesterEnd" | "studyShift"
> & {
  faculty: Pick<Faculty, "name">;
  department: Pick<Department, "name">;
  classroom: Pick<Classroom, "name"> & {
    building: Pick<Building, "name">;
  };
  academicLevel: Pick<AcademicLevel, "level">;
  courses: (Pick<
    Course,
    | "name"
    | "code"
    | "credits"
    | "day"
    | "firstSessionNote"
    | "secondSessionNote"
  > & {
    sessionTime: Pick<
      SessionTime,
      | "shift"
      | "firstSessionStartTime"
      | "firstSessionEndTime"
      | "secondSessionStartTime"
      | "secondSessionEndTime"
    >;
    teacher: {
      name: string;
      phone: string | null;
    };
  })[];
};

/**
 * Academic Year Type
 */
export type AcademicYear = typeof academicYears.$inferSelect;
