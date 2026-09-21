import { describe, expect, it } from "vitest";
import type { PrescriptionVariable } from "./exercise";
import { getPrescriptionPriority } from "./prescriptionPriority";

const standard = (key: "sets" | "recovery"): PrescriptionVariable => ({ kind: { type: "standard", key }, label: key });

describe("prescription priority", () => {
  it("classifies by metric kind and standard key", () => {
    expect(getPrescriptionPriority(standard("sets"))).toBe("primary");
    expect(getPrescriptionPriority(standard("recovery"))).toBe("secondary");
    expect(getPrescriptionPriority({ kind: { type: "specific", key: "stance" }, label: "Base" })).toBe("specific");
  });
});
