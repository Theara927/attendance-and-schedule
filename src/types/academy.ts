import {
  academicLevels,
  courses,
  departments,
  faculties,
  schedules,
  sessionTimes,
  students,
  teachers,
} from "@/database/schemas";

/**
 * Student Type
 */
export type Student = typeof students.$inferSelect;

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