import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z.string(),
  message: z.string(),
  facultyId: z.coerce.number(),
  targetDepartment: z.coerce.number().optional(),
  targetGeneration: z.coerce.number().optional(),
  priority: z.enum(["low", "normal", "high"]).optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

export const markAsReadSchema = z.object({
  recipientId: z.coerce.number(),
});

export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;

export const deleteNotificationSchema = z.object({
  id: z.coerce.number(),
});

export type DeleteNotificationInput = z.infer<typeof deleteNotificationSchema>;

export const getNotificationSchema = z.object({
  id: z.coerce.number(),
});

export type GetNotificationInput = z.infer<typeof getNotificationSchema>;

export const getUnreadNotificationsSchema = z.object({
  studentId: z.string(),
});

export type GetUnreadNotificationsInput = z.infer<
  typeof getUnreadNotificationsSchema
>;
