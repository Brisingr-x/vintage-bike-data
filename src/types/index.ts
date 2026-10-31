export const BICYCLE_CATEGORIES = [
  "road",
  "track",
  "vintage-mtb",
  "touring",
  "city",
  "gravel",
] as const;
export type BicycleCategory = (typeof BICYCLE_CATEGORIES)[number];

export const FRAME_MATERIALS = ["steel", "chromoly", "aluminum", "titanium", "carbon"] as const;
export type FrameMaterial = (typeof FRAME_MATERIALS)[number];

export const BOTTOM_BRACKET_STANDARDS = [
  "English threaded",
  "French threaded",
  "Italian threaded",
  "BB30",
  "BSA",
] as const;
export type BottomBracketStandard = (typeof BOTTOM_BRACKET_STANDARDS)[number];

export const HEADSET_STANDARDS = [
  "1-inch threaded",
  "1-1/8 inch threaded",
  "1-1/8 inch threadless",
  "1.5 inch",
] as const;
export type HeadsetStandard = (typeof HEADSET_STANDARDS)[number];

export interface DocumentationRecord {
  source?: string;
  url?: string;
  retrievedFrom?: string;
  notes?: string;
}

export interface FrameGeometry {
  seatTubeLengthMm: number;
  topTubeLengthMm: number;
  headTubeAngleDeg: number;
  seatTubeAngleDeg: number;
  chainstayLengthMm: number;
  wheelbaseMm: number;
}

export interface FrameSpecification {
  material: FrameMaterial;
  tubing: string;
  constructionType: string;
  bottomBracketStandard: BottomBracketStandard;
  headsetStandard: HeadsetStandard;
  rearSpacing: string;
  forkType: string;
  geometry: FrameGeometry;
}

export interface CranksetSpecification {
  brand: string;
  model: string;
  chainringTeeth: number[];
  bottomBracketStandard?: string;
}

export interface DerailleurSpecification {
  brand: string;
  model: string;
  type: string;
}

export interface ShifterSpecification {
  brand: string;
  model: string;
  type: string;
}

export interface FreewheelSpecification {
  speed: number;
  spacing: string;
  cogs: number[];
}

export interface DrivetrainSpecification {
  groupset: string;
  chain: string;
  crankset: CranksetSpecification;
  frontDerailleur?: DerailleurSpecification;
  rearDerailleur?: DerailleurSpecification;
  shifters?: ShifterSpecification;
  freewheel?: FreewheelSpecification;
}

export interface BrakeComponentSpecification {
  brand: string;
  model: string;
  type: string;
}

export interface BrakeLeversSpecification {
  brand: string;
  model: string;
  type: string;
}

export interface BrakeSpecification {
  type: string;
  front: BrakeComponentSpecification;
  rear: BrakeComponentSpecification;
  levers: BrakeLeversSpecification;
}

export interface TireCompatibility {
  widthMm: number[];
  bead: string;
  tubeless: boolean;
}

export interface WheelSpecification {
  rimSize: string;
  rimStandard: string;
  hubModel: string;
  rearSpacing: string;
  tireCompatibility: TireCompatibility;
  brakeSurface: string;
}

export interface HandlebarSpecification {
  material: string;
  widthMm: number;
  riseMm: number;
  barType: string;
}

export interface StemSpecification {
  material: string;
  lengthMm: number;
  riseMm: number;
}

export interface SaddleSpecification {
  material: string;
  model: string;
}

export interface CockpitSpecification {
  handlebar: HandlebarSpecification;
  stem: StemSpecification;
  saddle: SaddleSpecification;
}

export interface VintageBicycle {
  id?: string;
  make: string;
  model: string;
  modelYear: number;
  category: BicycleCategory;
  documentation: DocumentationRecord;
  frame: FrameSpecification;
  drivetrain: DrivetrainSpecification;
  brakes: BrakeSpecification;
  wheels: WheelSpecification;
  cockpit: CockpitSpecification;
}
