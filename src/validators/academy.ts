import z from "zod";

const academicLevelEnum = z.enum(["Associate", "Bachelor", "Master", "PhD"]);
const genderEnum = z.enum(["male", "female"]);
const educationalStatusEnum = z.enum([
  "enrolled",
  "graduated",
  "dropped out",
  "transferred",
]);
const dayEnum = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
]);
const studyShiftEnum = z.enum(["morning", "evening", "night"]);
/**
 * Faculty Schemas
 */
export const facultySchema = z.object({
  name: z.string().min(1, "Faculty name is required"),
});
export const facultyUpdateSchema = facultySchema.partial();

export type FacultyInput = z.infer<typeof facultySchema>;
export type FacultyUpdateInput = z.infer<typeof facultyUpdateSchema>;

/**
 * Academic Level Schemas
 */
export const academicLevelSchema = z.object({
  level: academicLevelEnum,
});
export const academicLevelUpdateSchema = academicLevelSchema.partial();

export type AcademicLevelInput = z.infer<typeof academicLevelSchema>;
export type AcademicLevelUpdateInput = z.infer<
  typeof academicLevelUpdateSchema
>;

/**
 * Department Schemas
 */
export const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  facultyId: z.number().int().positive(),
});
export const departmentUpdateSchema = departmentSchema.partial();

export type DepartmentInput = z.infer<typeof departmentSchema>;
export type DepartmentUpdateInput = z.infer<typeof departmentUpdateSchema>;

/**
 * Student Schemas
 */
export const studentSchema = z.object({
  id: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Student name is required"),
  phone: z.string().min(10).max(15),
  email: z.email("Invalid email format"),
  facultyId: z.number().int().positive(),
  departmentId: z.number().int().positive(),
  academicLevelId: z.number().int().positive(),
  educationalStatus: educationalStatusEnum,
  year: z.number().int().positive(),
  gender: genderEnum,
  generation: z.number().int().positive(),
  semester: z.number().int().positive(),
  isActive: z.boolean().default(true),
});
export const studentUpdateSchema = studentSchema.partial();

export type StudentInput = z.infer<typeof studentSchema>;
export type StudentUpdateInput = z.infer<typeof studentUpdateSchema>;

/**
 * Teacher Schemas
 */
export const teacherSchema = z.object({
  id: z.string().min(1, "Teacher ID is required"),
  name: z.string().min(1, "Teacher name is required"),
  phone: z.string().min(10).max(15),
  email: z.email("Invalid email format"),
  gender: genderEnum,
  academicLevelId: z.number().int().positive(),
  facultyId: z.number().int().positive(),
  isActive: z.boolean().default(true),
});
export const teacherUpdateSchema = teacherSchema.partial();

export type TeacherInput = z.infer<typeof teacherSchema>;
export type TeacherUpdateInput = z.infer<typeof teacherUpdateSchema>;

/**
 * Course Schemas
 */
export const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  code: z.string().min(1, "Course code is required"),
  credits: z.number().int().positive(),
  description: z.string().optional(),
  day: dayEnum,
  teacherId: z.string(),
  scheduleId: z.number().int().positive(),
  buildingId: z.number().int().positive(),
  classroomId: z.number().int().positive(),
  sessionTimeId: z.number().int().positive(),
  firstSessionNote: z.string().optional(),
  secondSessionNote: z.string().optional(),
  isActive: z.boolean().default(true),
  facultyId: z.number().int().positive(),
  departmentId: z.number().int().positive(),
  academicLevelId: z.number().int().positive(),
});
export const courseUpdateSchema = courseSchema.partial();

export type CourseInput = z.infer<typeof courseSchema>;
export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>;

/**
 * Session Time Schemas
 */
export const sessionTimeSchema = z.object({
  shift: studyShiftEnum,
  firstSessionStartTime: z
    .string()
    .min(1, "First session start time is required"),
  firstSessionEndTime: z.string().min(1, "First session end time is required"),
  secondSessionStartTime: z
    .string()
    .min(1, "Second session start time is required"),
  secondSessionEndTime: z
    .string()
    .min(1, "Second session end time is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});
export const sessionTimeUpdateSchema = sessionTimeSchema.partial();

export type SessionTimeInput = z.infer<typeof sessionTimeSchema>;
export type SessionTimeUpdateInput = z.infer<typeof sessionTimeUpdateSchema>;

/**
 * Schedule
 */
export const scheduleSchema = z.object({
  facultyId: z.coerce.number().positive(),
  year: z.coerce.number().positive(),
  academicLevelId: z.coerce.number().positive(),
  generation: z.coerce.number().positive(),
  departmentId: z.coerce.number().positive(),
  semester: z.coerce.number().positive(),
  semesterStart: z.coerce.date(),
  semesterEnd: z.coerce.date(),
  studyShift: studyShiftEnum,
});

export const scheduleUniqueKeySchema = z.object({
  facultyId: z.coerce.number().positive(),
  year: z.coerce.number().positive(),
  academicLevelId: z.coerce.number().positive(),
  generation: z.coerce.number().positive(),
  departmentId: z.coerce.number().positive(),
  semester: z.coerce.number().positive(),
  studyShift: studyShiftEnum,
});
export const scheduleUpdateSchema = scheduleSchema.partial();

export const scheduleWithCoursesSchema = z.object({
  schedule: scheduleSchema,
  courses: z.array(courseSchema.omit({ scheduleId: true })),
});

export type ScheduleInput = z.infer<typeof scheduleSchema>;
export type ScheduleUpdateInput = z.infer<typeof scheduleUpdateSchema>;
export type ScheduleUniqueKeyInput = z.infer<typeof scheduleUniqueKeySchema>;
export type ScheduleWithCoursesInput = z.infer<
  typeof scheduleWithCoursesSchema
>;
