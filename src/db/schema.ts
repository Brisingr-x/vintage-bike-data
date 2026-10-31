import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import type {
  BicycleCategory,
  BrakeSpecification,
  CockpitSpecification,
  DocumentationRecord,
  DrivetrainSpecification,
  FrameSpecification,
  WheelSpecification,
} from "../types/index";

const bicycleCategories = [
  "road",
  "track",
  "vintage-mtb",
  "touring",
  "city",
  "gravel",
] as const satisfies readonly BicycleCategory[];

export const bicycleCategoryEnum = pgEnum("bicycle_category", bicycleCategories);

export const vintageBicycles = pgTable(
  "vintage_bicycles",
  {
    id: serial("id").primaryKey(),
    make: varchar("make", { length: 128 }).notNull(),
    model: varchar("model", { length: 128 }).notNull(),
    modelYear: integer("model_year").notNull(),
    category: bicycleCategoryEnum("category").notNull(),
    documentation: jsonb("documentation").$type<DocumentationRecord>().notNull(),
    frameSpecification: jsonb("frame_specification").$type<FrameSpecification>().notNull(),
    drivetrainSpecification: jsonb("drivetrain_specification")
      .$type<DrivetrainSpecification>()
      .notNull(),
    brakeSpecification: jsonb("brake_specification").$type<BrakeSpecification>().notNull(),
    wheelSpecification: jsonb("wheel_specification").$type<WheelSpecification>().notNull(),
    cockpitSpecification: jsonb("cockpit_specification").$type<CockpitSpecification>().notNull(),
    rawData: jsonb("raw_data").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    makeModelYearIdx: index("vintage_bicycles_make_model_year_idx").on(
      table.make,
      table.model,
      table.modelYear,
    ),
    modelIdx: index("vintage_bicycles_model_idx").on(table.model),
    modelYearIdx: index("vintage_bicycles_model_year_idx").on(table.modelYear),
    categoryIdx: index("vintage_bicycles_category_idx").on(table.category),
    documentationGinIdx: index("vintage_bicycles_documentation_gin_idx").using(
      "gin",
      table.documentation,
    ),
    frameSpecGinIdx: index("vintage_bicycles_frame_spec_gin_idx").using(
      "gin",
      table.frameSpecification,
    ),
    drivetrainSpecGinIdx: index("vintage_bicycles_drivetrain_spec_gin_idx").using(
      "gin",
      table.drivetrainSpecification,
    ),
    brakeSpecGinIdx: index("vintage_bicycles_brake_spec_gin_idx").using(
      "gin",
      table.brakeSpecification,
    ),
    wheelSpecGinIdx: index("vintage_bicycles_wheel_spec_gin_idx").using(
      "gin",
      table.wheelSpecification,
    ),
    cockpitSpecGinIdx: index("vintage_bicycles_cockpit_spec_gin_idx").using(
      "gin",
      table.cockpitSpecification,
    ),
    rawDataGinIdx: index("vintage_bicycles_raw_data_gin_idx").using("gin", table.rawData),
  }),
);

export type VintageBicycleRecord = typeof vintageBicycles.$inferSelect;
export type NewVintageBicycleRecord = typeof vintageBicycles.$inferInsert;
