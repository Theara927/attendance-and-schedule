import z from "zod";

export const attendanceStatusEnum = z.enum([
  "present",
  "absent",
  "late",
  "excused",
]);

export const markAttendanceSchema = z.object({
  courseId: z.coerce.number().positive(),
  studentId: z.string(),
  date: z.iso.date(),
  status: attendanceStatusEnum,
  session: z.coerce.number().positive(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  recordedBy: z.string().optional(),
});

export const bulkAttendanceSchema = z.object({
  courseId: z.coerce.number().positive(),
  date: z.iso.date(),
  session: z.coerce.number().positive(),
  mark: z
    .array(
      z.object({
        studentId: z.string(),
        status: attendanceStatusEnum,
        notes: z
          .string()
          .max(500, "Notes cannot exceed 500 characters")
          .optional(),
      }),
    )
    .min(1, "At least one attendance record is required"),
  recordedBy: z.string().optional(),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;
export type BulkAttendanceInput = z.infer<typeof bulkAttendanceSchema>;
