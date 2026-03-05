import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
  index,
  text,
  unique,
} from "drizzle-orm/pg-core";
import {
  academicLevel,
  dayEnum,
  educationalStatus,
  gender,
  studyShiftEnum,
} from "./enums";
import { user } from "./authentication";
import { buildings, classrooms } from "./infrastructure";

export const faculties = pgTable("faculties", {
  id: serial("id").primaryKey(),
  name: varchar("name").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const departments = pgTable(
  "departments",
  {
    id: serial("id").primaryKey(),
    name: varchar("name").unique().notNull(),
    facultyId: integer("faculty_id")
      .notNull()
      .references(() => faculties.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("unique_faculty_department").on(table.facultyId, table.name),
  ],
);

export const sessionTimes = pgTable(
  "session_times",
  {
    id: serial("id").primaryKey(),
    shift: studyShiftEnum("shift").unique().notNull(),
    firstSessionStartTime: varchar("first_session_start_time").notNull(),
    firstSessionEndTime: varchar("first_session_end_time").notNull(),
    secondSessionStartTime: varchar("second_session_start_time").notNull(),
    secondSessionEndTime: varchar("second_session_end_time").notNull(),
    description: varchar("description"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    unique("unique_session_time").on(
      table.shift,
      table.firstSessionStartTime,
      table.firstSessionEndTime,
      table.secondSessionStartTime,
      table.secondSessionEndTime,
    ),
  ],
);

export const academicLevels = pgTable("academic_levels", {
  id: serial("id").primaryKey(),
  level: academicLevel("level").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const schedules = pgTable(
  "schedules",
  {
    id: serial("id").primaryKey(),
    facultyId: integer("faculty_id")
      .notNull()
      .references(() => faculties.id),
    year: integer("year").notNull(),
    academicLevelId: integer("academic_level_id")
      .notNull()
      .references(() => academicLevels.id),
    generation: integer("generation").notNull(),
    departmentId: integer("department_id")
      .notNull()
      .references(() => departments.id),
    semester: integer("semester").notNull(),
    semesterStart: timestamp("semester_start").notNull(),
    semesterEnd: timestamp("semester_end").notNull(),
    studyShift: studyShiftEnum("study_shift").default("morning"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("unique_schedule_identifier").on(
      table.facultyId,
      table.academicLevelId,
      table.generation,
      table.semester,
      table.year,
      table.departmentId,
    ),
    index("idx_schedule_faculty_generation").on(
      table.facultyId,
      table.generation,
    ),
  ],
);

export const courses = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    code: varchar("code").unique(),
    credits: integer("credits"),
    description: varchar("description"),
    day: dayEnum("day").notNull(),
    teacherId: integer("teacher_id")
      .notNull()
      .references(() => teachers.id),
    scheduleId: integer("schedule_id")
      .notNull()
      .references(() => schedules.id),
    buildingId: integer("building_id")
      .notNull()
      .references(() => buildings.id),
    classroomId: integer("classroom_id")
      .notNull()
      .references(() => classrooms.id),
    sessionTimeId: integer("session_time_id")
      .notNull()
      .references(() => sessionTimes.id),
    firstSessionNote: varchar("first_session_note"),
    secondSessionNote: varchar("second_session_note"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_course_teacher").on(table.teacherId),
    index("idx_course_schedule").on(table.scheduleId),
    index("idx_course_day_schedule").on(table.day, table.scheduleId),
    uniqueIndex("unique_schedule_day_classroom_time").on(
      table.scheduleId,
      table.day,
      table.buildingId,
      table.classroomId,
      table.sessionTimeId,
    ),
  ],
);

export const teachers = pgTable(
  "teachers",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .references(() => user.id)
      .unique(),
    name: varchar("name").notNull(),
    phone: varchar("phone").unique(),
    email: varchar("email").unique(),
    gender: gender("gender"),
    academicLevelId: integer("academic_level_id").references(
      () => academicLevels.id,
    ),
    facultyId: integer("faculty_id").references(() => faculties.id),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("idx_teacher_faculty").on(table.facultyId)],
);

export const students = pgTable(
  "students",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .references(() => user.id)
      .unique(),
    name: varchar("name").notNull(),
    phone: varchar("phone").unique(),
    email: varchar("email").unique().notNull(),
    facultyId: integer("faculty_id").references(() => faculties.id),
    departmentId: integer("department_id").references(() => departments.id),
    academicLevelId: integer("academic_level_id").references(
      () => academicLevels.id,
    ),
    educationalStatus: educationalStatus("educational_status"),
    year: integer("year"),
    gender: gender("gender"),
    generation: integer("generation"),
    semester: integer("semester"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_student_schedule_filter").on(
      table.facultyId,
      table.academicLevelId,
      table.generation,
      table.semester,
      table.year,
    ),
  ],
);
