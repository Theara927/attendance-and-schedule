import { relations } from "drizzle-orm";
import { user, session, account } from "./authentication";
import {
  faculties,
  departments,
  academicLevels,
  schedules,
  teachers,
  students,
  sessionTimes,
} from "./academic";
import { buildings, classrooms } from "./infrastructure";
import { courses } from "./academic";
import { attendanceRecords } from "./attendance";
import { notifications, notificationRecipients } from "./notification";

// Auth Relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// Academic Relations
export const facultiesRelations = relations(faculties, ({ many }) => ({
  departments: many(departments),
  academicLevels: many(academicLevels),
  teachers: many(teachers),
  schedules: many(schedules),
  students: many(students),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  faculty: one(faculties, {
    fields: [departments.facultyId],
    references: [faculties.id],
  }),
  schedules: many(schedules),
}));

export const academicLevelsRelations = relations(
  academicLevels,
  ({ many }) => ({
    schedules: many(schedules),
    students: many(students),
  }),
);

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
  faculty: one(faculties, {
    fields: [schedules.facultyId],
    references: [faculties.id],
  }),
  department: one(departments, {
    fields: [schedules.departmentId],
    references: [departments.id],
  }),
  academicLevel: one(academicLevels, {
    fields: [schedules.academicLevelId],
    references: [academicLevels.id],
  }),
  courses: many(courses),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  faculty: one(faculties, {
    fields: [teachers.facultyId],
    references: [faculties.id],
  }),
  courses: many(courses),
}));

export const studentsRelations = relations(students, ({ one }) => ({
  academicLevel: one(academicLevels, {
    fields: [students.academicLevelId],
    references: [academicLevels.id],
  }),
  faculty: one(faculties, {
    fields: [students.facultyId],
    references: [faculties.id],
  }),
}));

// Infrastructure Relations
export const buildingsRelations = relations(buildings, ({ many }) => ({
  classrooms: many(classrooms),
  courses: many(courses),
}));

export const classroomsRelations = relations(classrooms, ({ one, many }) => ({
  building: one(buildings, {
    fields: [classrooms.buildingId],
    references: [buildings.id],
  }),
  courses: many(courses),
}));

export const sessionTimesRelations = relations(sessionTimes, ({ many }) => ({
  courses: many(courses),
}));

// Course Relations
export const coursesRelations = relations(courses, ({ one }) => ({
  teacher: one(teachers, {
    fields: [courses.teacherId],
    references: [teachers.id],
  }),
  schedule: one(schedules, {
    fields: [courses.scheduleId],
    references: [schedules.id],
  }),
  building: one(buildings, {
    fields: [courses.buildingId],
    references: [buildings.id],
  }),
  classroom: one(classrooms, {
    fields: [courses.classroomNumber],
    references: [classrooms.number],
  }),
  sessionTime: one(sessionTimes, {
    fields: [courses.sessionTimeId],
    references: [sessionTimes.id],
  }),
}));

// Attendance Relations
export const attendanceRecordsRelations = relations(
  attendanceRecords,
  ({ one }) => ({
    course: one(courses, {
      fields: [attendanceRecords.courseId],
      references: [courses.id],
    }),
    student: one(students, {
      fields: [attendanceRecords.studentId],
      references: [students.id],
    }),
    recordedByTeacher: one(teachers, {
      fields: [attendanceRecords.recordedBy],
      references: [teachers.id],
    }),
  }),
);

export const userTeacherRelations = relations(user, ({ one }) => ({
  teacher: one(teachers, {
    fields: [user.id],
    references: [teachers.userId],
  }),
}));

export const userStudentRelations = relations(user, ({ one }) => ({
  student: one(students, {
    fields: [user.id],
    references: [students.userId],
  }),
}));
