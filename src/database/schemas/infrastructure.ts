import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const buildings = pgTable("buildings", {
  id: serial("building_id").primaryKey(),
  name: varchar("name").unique().notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const classrooms = pgTable(
  "classrooms",
  {
    id: serial("classroom_id").primaryKey(),
    number: integer("number").primaryKey(),
    name: varchar("name").unique().notNull(),
    buildingId: integer("building_id")
      .notNull()
      .references(() => buildings.id),
    isAvailable: boolean("is_available").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("unique_building_classroom_number").on(
      table.buildingId,
      table.number,
    ),
  ],
);
