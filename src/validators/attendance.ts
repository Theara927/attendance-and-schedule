import z from "zod";

export const attendanceStatusEnum = z.enum([
  "present",
  "absent",
  "late",
  "excused",
]);

export const markAttendanceSchema = z.object({
  courseId: z.coerce.number().positive(),
  studentId: z.coerce.number().positive(),
  date: z.iso.date(),
  status: attendanceStatusEnum,
  session: z.coerce.number().positive(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  recordedBy: z.coerce.number().positive(),
});

export const bulkAttendanceSchema = z.object({
  courseId: z.coerce.number().positive(),
  date: z.iso.date(),
  session: z.coerce.number().positive(),
  mark: z
    .array(
      z.object({
        studentId: z.coerce.number().positive(),
        status: attendanceStatusEnum,
        notes: z
          .string()
          .max(500, "Notes cannot exceed 500 characters")
          .optional(),
      }),
    )
    .min(1, "At least one attendance record is required"),
  recordedBy: z.coerce.number().positive(),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
export type BulkAttendanceInput = z.infer<typeof bulkAttendanceSchema>;
