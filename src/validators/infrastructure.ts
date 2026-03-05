import z, { boolean, string } from "zod";

/**
 * Building Schemas
 */

export const buildingSchema = z.object({
  name: string().min(3).max(99),
  isActive: boolean().optional(),
});
export const buildingUpdateSchema = buildingSchema.partial();

export type BuildingInput = z.infer<typeof buildingSchema>;
export type BuildingUpdateInput = z.infer<typeof buildingUpdateSchema>;

/**
 * Classroom Schemas
 */
export const classroomSchema = z.object({
  classroomNumber: z.number().int().positive(),
  name: string().min(3).max(99),
  buildingId: z.number().int().positive(),
  isAvailable: boolean().optional(),
});
export const classroomUpdateSchema = classroomSchema.partial();

export type ClassroomInput = z.infer<typeof classroomSchema>;
export type ClassroomUpdateInput = z.infer<typeof classroomUpdateSchema>;
