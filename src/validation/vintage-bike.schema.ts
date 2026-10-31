import { z } from "zod";
import {
  BICYCLE_CATEGORIES,
  BOTTOM_BRACKET_STANDARDS,
  FRAME_MATERIALS,
  HEADSET_STANDARDS,
} from "../types/index";
import type { VintageBicycle as VintageBicycleContract } from "../types/index";

export const bicycleCategorySchema = z.enum(BICYCLE_CATEGORIES);
export const frameMaterialSchema = z.enum(FRAME_MATERIALS);
export const bottomBracketStandardSchema = z.enum(BOTTOM_BRACKET_STANDARDS);
export const headsetStandardSchema = z.enum(HEADSET_STANDARDS);

export const documentationSchema = z
  .object({
    source: z.string().optional(),
    url: z.string().url().optional(),
    retrievedFrom: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict();

export const frameGeometrySchema = z
  .object({
    seatTubeLengthMm: z.number().int().positive(),
    topTubeLengthMm: z.number().int().positive(),
    headTubeAngleDeg: z.number().min(40).max(90),
    seatTubeAngleDeg: z.number().min(40).max(90),
    chainstayLengthMm: z.number().int().positive(),
    wheelbaseMm: z.number().int().positive(),
  })
  .strict();

export const frameSpecificationSchema = z
  .object({
    material: frameMaterialSchema,
    tubing: z.string().min(2),
    constructionType: z.string().min(2),
    bottomBracketStandard: bottomBracketStandardSchema,
    headsetStandard: headsetStandardSchema,
    rearSpacing: z.string().min(2),
    forkType: z.string().min(2),
    geometry: frameGeometrySchema,
  })
  .strict();

export const cranksetSchema = z
  .object({
    brand: z.string().min(2),
    model: z.string().min(2),
    chainringTeeth: z.array(z.number().int().positive()).min(1),
    bottomBracketStandard: z.string().optional(),
  })
  .strict();

export const derailleurSchema = z
  .object({
    brand: z.string().min(2),
    model: z.string().min(2),
    type: z.string().min(2),
  })
  .strict();

export const shifterSchema = z
  .object({
    brand: z.string().min(2),
    model: z.string().min(2),
    type: z.string().min(2),
  })
  .strict();

export const freewheelSchema = z
  .object({
    speed: z.number().int().positive(),
    spacing: z.string().min(2),
    cogs: z.array(z.number().int().positive()).min(1),
  })
  .strict();

export const drivetrainSpecificationSchema = z
  .object({
    groupset: z.string().min(2),
    chain: z.string().min(2),
    crankset: cranksetSchema,
    frontDerailleur: derailleurSchema.optional(),
    rearDerailleur: derailleurSchema.optional(),
    shifters: shifterSchema.optional(),
    freewheel: freewheelSchema.optional(),
  })
  .strict();

export const brakeComponentSchema = z
  .object({
    brand: z.string().min(2),
    model: z.string().min(2),
    type: z.string().min(2),
  })
  .strict();

export const brakeLeversSchema = z
  .object({
    brand: z.string().min(2),
    model: z.string().min(2),
    type: z.string().min(2),
  })
  .strict();

export const brakeSpecificationSchema = z
  .object({
    type: z.string().min(2),
    front: brakeComponentSchema,
    rear: brakeComponentSchema,
    levers: brakeLeversSchema,
  })
  .strict();

export const tireCompatibilitySchema = z
  .object({
    widthMm: z.array(z.number().int().positive()).min(1),
    bead: z.string().min(2),
    tubeless: z.boolean(),
  })
  .strict();

export const wheelSpecificationSchema = z
  .object({
    rimSize: z.string().min(2),
    rimStandard: z.string().min(2),
    hubModel: z.string().min(2),
    rearSpacing: z.string().min(2),
    tireCompatibility: tireCompatibilitySchema,
    brakeSurface: z.string().min(2),
  })
  .strict();

export const handlebarSchema = z
  .object({
    material: z.string().min(2),
    widthMm: z.number().int().positive(),
    riseMm: z.number().int().min(0),
    barType: z.string().min(2),
  })
  .strict();

export const stemSchema = z
  .object({
    material: z.string().min(2),
    lengthMm: z.number().int().positive(),
    riseMm: z.number().int().min(0),
  })
  .strict();

export const saddleSchema = z
  .object({
    material: z.string().min(2),
    model: z.string().min(2),
  })
  .strict();

export const cockpitSpecificationSchema = z
  .object({
    handlebar: handlebarSchema,
    stem: stemSchema,
    saddle: saddleSchema,
  })
  .strict();

export const vintageBicycleSchema = z
  .object({
    id: z.string().optional(),
    make: z.string().min(2),
    model: z.string().min(2),
    modelYear: z.number().int().min(1900).max(2100),
    category: bicycleCategorySchema,
    documentation: documentationSchema,
    frame: frameSpecificationSchema,
    drivetrain: drivetrainSpecificationSchema,
    brakes: brakeSpecificationSchema,
    wheels: wheelSpecificationSchema,
    cockpit: cockpitSpecificationSchema,
  })
  .strict() satisfies z.ZodType<VintageBicycleContract>;

export type BicycleCategory = z.infer<typeof bicycleCategorySchema>;
export type FrameMaterial = z.infer<typeof frameMaterialSchema>;
export type BottomBracketStandard = z.infer<typeof bottomBracketStandardSchema>;
export type HeadsetStandard = z.infer<typeof headsetStandardSchema>;
export type DocumentationRecord = z.infer<typeof documentationSchema>;
export type FrameGeometry = z.infer<typeof frameGeometrySchema>;
export type FrameSpecification = z.infer<typeof frameSpecificationSchema>;
export type CranksetSpecification = z.infer<typeof cranksetSchema>;
export type DerailleurSpecification = z.infer<typeof derailleurSchema>;
export type ShifterSpecification = z.infer<typeof shifterSchema>;
export type FreewheelSpecification = z.infer<typeof freewheelSchema>;
export type DrivetrainSpecification = z.infer<typeof drivetrainSpecificationSchema>;
export type BrakeComponentSpecification = z.infer<typeof brakeComponentSchema>;
export type BrakeLeversSpecification = z.infer<typeof brakeLeversSchema>;
export type BrakeSpecification = z.infer<typeof brakeSpecificationSchema>;
export type TireCompatibility = z.infer<typeof tireCompatibilitySchema>;
export type WheelSpecification = z.infer<typeof wheelSpecificationSchema>;
export type HandlebarSpecification = z.infer<typeof handlebarSchema>;
export type StemSpecification = z.infer<typeof stemSchema>;
export type SaddleSpecification = z.infer<typeof saddleSchema>;
export type CockpitSpecification = z.infer<typeof cockpitSpecificationSchema>;
export type VintageBicycle = z.infer<typeof vintageBicycleSchema>;
