import z, { boolean, string } from "zod";

/**
 * Building Schemas
 */

export const buildingSchema = z.object({
  name: string().min(3).max(99),
  isActive: boolean().optional(),
});
export const buildingUpdateSchema = buildingSchema.partial();
export const buildingQuerySchema = z.object({
  name: string().optional(),
  isActive: boolean().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

export type BuildingInput = z.infer<typeof buildingSchema>;
export type BuildingUpdateInput = z.infer<typeof buildingUpdateSchema>;
export type BuildingQueryInput = z.infer<typeof buildingQuerySchema>;

/**
 * Classroom Schemas
 */
export const classroomSchema = z.object({
  classroomNumber: z.number().int().positive(),
  name: string().min(3).max(99),
  buildingId: z.number().int().positive(),
  floor: z.number().int().positive(),
  isAvailable: boolean().optional(),
});
export const classroomUpdateSchema = classroomSchema.partial();
export const classroomQuerySchema = z.object({
  name: string().optional(),
  floor: z.number().int().positive().optional(),
  isAvailable: boolean().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});

export type ClassroomInput = z.infer<typeof classroomSchema>;
export type ClassroomUpdateInput = z.infer<typeof classroomUpdateSchema>;
export type ClassroomQueryInput = z.infer<typeof classroomQuerySchema>;
