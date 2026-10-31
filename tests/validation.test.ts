import { describe, expect, it } from "vitest";

import sample from "../src/seed/1988-stumpjumper.json" with { type: "json" };
import { vintageBicycleSchema } from "../src/validation/vintage-bike.schema.js";

describe("vintage bike validation", () => {
  it("accepts the 1988 Stumpjumper sample record", () => {
    const result = vintageBicycleSchema.parse(sample);

    expect(result.make).toBe("Specialized");
    expect(result.model).toBe("Stumpjumper");
    expect(result.modelYear).toBe(1988);
    expect(result.category).toBe("vintage-mtb");
    expect(result.frame.material).toBe("steel");
    expect(result.brakes.type).toBe("cantilever");
    expect(result.wheels.rimStandard).toBe("ISO 559");
    expect(result.cockpit.stem.lengthMm).toBe(90);
  });
});
