import type { AssessmentRecord } from "@/features/assessments/domain/assessmentRecord";
import type { SessionExecution } from "@/features/session-execution/domain/sessionExecution";

export type AthleteBiologicalStage = "pre_phv" | "circa_phv" | "post_phv" | "unknown";

export type Athlete = {
  id: string;
  alias: string;
  sport: string;
  stage: AthleteBiologicalStage;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type AthleteExportData = {
  version: 1;
  exportedAt: string;
  athlete: Athlete;
  evaluations: AssessmentRecord[];
  sessionExecutions: SessionExecution[];
};

export function isAthlete(value: unknown): value is Athlete {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  const validStages: AthleteBiologicalStage[] = ["pre_phv", "circa_phv", "post_phv", "unknown"];

  return (
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    typeof candidate.alias === "string" &&
    typeof candidate.sport === "string" &&
    typeof candidate.stage === "string" &&
    validStages.includes(candidate.stage as AthleteBiologicalStage) &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

export function isAthleteExportData(value: unknown): value is AthleteExportData {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;

  return (
    candidate.version === 1 &&
    typeof candidate.exportedAt === "string" &&
    isAthlete(candidate.athlete) &&
    Array.isArray(candidate.evaluations) &&
    Array.isArray(candidate.sessionExecutions)
  );
}
