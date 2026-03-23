import { buildings, classrooms } from "@/database/schemas";

/**
 * Building Types
 */
export type Building = typeof buildings.$inferSelect;

/**
 * Classroom Types
 */
export type Classroom = typeof classrooms.$inferSelect;

export type ClassroomWithBuilding = Classroom & { building: Building };
