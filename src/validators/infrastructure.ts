import z from "zod";

/**
 * Building Schemas
 */

export const buildingSchema = z.object({
  name: z.string().min(3).max(99),
  isActive: z.boolean().optional(),
});
export const buildingUpdateSchema = buildingSchema.partial();
export const buildingQuerySchema = z.object({
  name: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export type BuildingInput = z.infer<typeof buildingSchema>;
export type BuildingUpdateInput = z.infer<typeof buildingUpdateSchema>;
export type BuildingQueryInput = z.infer<typeof buildingQuerySchema>;

/**
 * Classroom Schemas
 */
export const classroomSchema = z.object({
  classroomNumber: z.number().int().positive(),
  name: z.string().min(3).max(99),
  buildingId: z.number().int().positive(),
  floor: z.number().int().positive(),
  isAvailable: z.boolean().optional(),
});
export const classroomUpdateSchema = classroomSchema.partial();
export const classroomQuerySchema = z.object({
  name: z.string().optional(),
  floor: z.coerce.number().int().positive().optional(),
  isAvailable: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export type ClassroomInput = z.infer<typeof classroomSchema>;
export type ClassroomUpdateInput = z.infer<typeof classroomUpdateSchema>;
export type ClassroomQueryInput = z.infer<typeof classroomQuerySchema>;
