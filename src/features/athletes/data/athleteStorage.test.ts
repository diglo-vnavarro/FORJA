import { beforeEach, describe, expect, it } from "vitest";
import {
  isAthlete,
  isAthleteExportData,
  type Athlete,
  type AthleteExportData,
} from "../domain/athlete";
import {
  clearAllAthletes,
  deleteAthlete,
  exportAthleteData,
  getAthleteById,
  importAthleteData,
  loadAthletes,
  saveAthlete,
  ATHLETES_STORAGE_KEY,
} from "./athleteStorage";
import {
  saveAssessmentRecord,
  loadAssessmentRecords,
} from "@/features/assessments/data/assessmentRecordStorage";
import type { AssessmentRecord } from "@/features/assessments/domain/assessmentRecord";

describe("athlete domain and storage under D-021", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const sampleAthlete: Athlete = {
    id: "ath-iker-01",
    alias: "Iker",
    sport: "Fútbol",
    stage: "circa_phv",
    notes: "Etapa de estirón puberal. Prioridad técnica y control de carga.",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
  };

  const sampleEvaluation: AssessmentRecord = {
    id: "rec-iker-01",
    athleteId: "ath-iker-01",
    assessmentId: "EVAL-001",
    date: "2026-10-02T10:00:00.000Z",
    taskResults: {
      "t-1": { taskId: "t-1", competence: "sufficient", selectedExerciseId: "EX-002" },
    },
    recommendedExerciseIds: ["EX-002"],
  };

  it("validates conforming athlete and export objects", () => {
    expect(isAthlete(sampleAthlete)).toBe(true);
    expect(isAthlete(null)).toBe(false);
    expect(isAthlete({ ...sampleAthlete, stage: "invalid_stage" })).toBe(false);

    const exportData: AthleteExportData = {
      version: 1,
      exportedAt: "2026-10-05T12:00:00.000Z",
      athlete: sampleAthlete,
      evaluations: [sampleEvaluation],
      sessionExecutions: [],
    };
    expect(isAthleteExportData(exportData)).toBe(true);
    expect(isAthleteExportData({ ...exportData, version: 2 })).toBe(false);
  });

  it("saves, loads and updates athlete profiles in localStorage", () => {
    saveAthlete(sampleAthlete);
    const athletes = loadAthletes();
    expect(athletes).toHaveLength(1);
    expect(athletes[0].alias).toBe("Iker");

    const updated = { ...sampleAthlete, notes: "Notas actualizadas" };
    saveAthlete(updated);
    expect(loadAthletes()).toHaveLength(1);
    expect(getAthleteById("ath-iker-01")?.notes).toBe("Notas actualizadas");
  });

  it("exports athlete data including associated evaluations", () => {
    saveAthlete(sampleAthlete);
    saveAssessmentRecord(sampleEvaluation);

    const exported = exportAthleteData("ath-iker-01");
    expect(exported).not.toBeNull();
    expect(exported?.athlete.id).toBe("ath-iker-01");
    expect(exported?.evaluations).toHaveLength(1);
    expect(exported?.evaluations[0].id).toBe("rec-iker-01");
  });

  it("imports athlete data safely restoring profile and evaluations", () => {
    const backup: AthleteExportData = {
      version: 1,
      exportedAt: "2026-10-05T12:00:00.000Z",
      athlete: sampleAthlete,
      evaluations: [sampleEvaluation],
      sessionExecutions: [],
    };

    const success = importAthleteData(backup);
    expect(success).toBe(true);
    expect(loadAthletes()).toHaveLength(1);
    expect(loadAssessmentRecords()).toHaveLength(1);
    expect(getAthleteById("ath-iker-01")?.alias).toBe("Iker");
  });

  it("deletes athlete and all associated data fulfilling right to erasure (D-021)", () => {
    saveAthlete(sampleAthlete);
    saveAssessmentRecord(sampleEvaluation);

    deleteAthlete("ath-iker-01", localStorage, true);
    expect(loadAthletes()).toHaveLength(0);
    expect(loadAssessmentRecords()).toHaveLength(0);
  });

  it("validates and imports the official example project data (examples/proyecto-iker)", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const example = require("../../../../examples/proyecto-iker/iker-perfil-export.json");
    expect(isAthleteExportData(example)).toBe(true);
    const ok = importAthleteData(example);
    expect(ok).toBe(true);
    expect(getAthleteById("ath-iker-01")?.alias).toBe("Iker");
  });

  it("handles corrupted storage data gracefully", () => {
    localStorage.setItem(ATHLETES_STORAGE_KEY, "invalid json");
    expect(loadAthletes()).toEqual([]);

    clearAllAthletes();
    expect(loadAthletes()).toEqual([]);
  });
});
