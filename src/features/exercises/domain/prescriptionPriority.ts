import type { PrescriptionVariable } from "./exercise";

export type PrescriptionPriority = "primary" | "secondary" | "specific";

const primaryKeys = new Set(["sets", "repetitions", "time", "distance", "load"]);
const secondaryKeys = new Set(["recovery", "rpe", "rir", "range", "tempo", "intention", "quality"]);

export const getPrescriptionPriority = (metric: PrescriptionVariable): PrescriptionPriority => metric.kind.type === "specific" ? "specific" : primaryKeys.has(metric.kind.key) ? "primary" : secondaryKeys.has(metric.kind.key) ? "secondary" : "specific";
