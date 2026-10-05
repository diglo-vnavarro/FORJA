import { describe, expect, it, beforeEach } from "vitest";
import {
  compareAssessmentRecords,
  isAssessmentRecord,
  type AssessmentRecord,
} from "../domain/assessmentRecord";
import {
  clearAllAssessmentRecords,
  deleteAssessmentRecord,
  getAssessmentRecordById,
  getAssessmentRecordsByAthlete,
  loadAssessmentRecords,
  saveAssessmentRecord,
  ASSESSMENT_RECORDS_STORAGE_KEY,
} from "./assessmentRecordStorage";

describe("assessment record domain and schema validation", () => {
  const validRecord: AssessmentRecord = {
    id: "rec-001",
    athleteId: "ath-iker-01",
    assessmentId: "EVAL-001",
    date: "2026-10-05T10:00:00.000Z",
    taskResults: {
      "tarea-1-sentadilla": {
        taskId: "tarea-1-sentadilla",
        competence: "sufficient",
        selectedExerciseId: "EX-002",
      },
    },
    recommendedExerciseIds: ["EX-002"],
  };

  it("validates correct assessment record structure with isAssessmentRecord", () => {
    expect(isAssessmentRecord(validRecord)).toBe(true);
    expect(isAssessmentRecord(null)).toBe(false);
    expect(isAssessmentRecord({})).toBe(false);
    expect(isAssessmentRecord({ ...validRecord, assessmentId: "INVALID" })).toBe(false);
    expect(isAssessmentRecord({ ...validRecord, id: 123 })).toBe(false);
  });

  it("compares two assessment records and computes accurate progress indicators", () => {
    const record1: AssessmentRecord = {
      ...validRecord,
      id: "rec-001",
      date: "2026-09-01T10:00:00.000Z",
      taskResults: {
        "task-squat": { taskId: "task-squat", competence: "partial" },
        "task-hinge": { taskId: "task-hinge", competence: "insufficient" },
        "task-push": { taskId: "task-push", competence: "sufficient" },
        "task-pull": { taskId: "task-pull", competence: "not_measured" },
      },
    };

    const record2: AssessmentRecord = {
      ...validRecord,
      id: "rec-002",
      date: "2026-10-01T10:00:00.000Z",
      taskResults: {
        "task-squat": { taskId: "task-squat", competence: "sufficient" }, // improved (partial -> sufficient)
        "task-hinge": { taskId: "task-hinge", competence: "partial" }, // improved (insufficient -> partial)
        "task-push": { taskId: "task-push", competence: "sufficient" }, // maintained
        "task-pull": { taskId: "task-pull", competence: "sufficient" }, // unmeasured -> unmeasured (started unmeasured)
        "task-lunge": { taskId: "task-lunge", competence: "partial" }, // new (unmeasured in record1)
      },
    };

    const progress = compareAssessmentRecords(record1, record2);

    expect(progress.summary.improved).toBe(2);
    expect(progress.summary.maintained).toBe(1);
    expect(progress.summary.regressed).toBe(0);
    expect(progress.summary.unmeasured).toBe(2);
    expect(progress.tasks.find((t) => t.taskId === "task-squat")?.status).toBe("improved");
    expect(progress.tasks.find((t) => t.taskId === "task-push")?.status).toBe("maintained");
  });
});

describe("assessment record persistence (D-021 client storage)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const recordA: AssessmentRecord = {
    id: "rec-100",
    athleteId: "ath-iker-01",
    assessmentId: "EVAL-001",
    date: "2026-10-05T09:00:00.000Z",
    taskResults: {
      "task-1": { taskId: "task-1", competence: "sufficient", selectedExerciseId: "EX-002" },
    },
    recommendedExerciseIds: ["EX-002"],
  };

  const recordB: AssessmentRecord = {
    id: "rec-200",
    athleteId: "ath-mateo-02",
    assessmentId: "EVAL-001",
    date: "2026-10-05T11:00:00.000Z",
    taskResults: {
      "task-1": { taskId: "task-1", competence: "partial", selectedExerciseId: "EX-001" },
    },
    recommendedExerciseIds: ["EX-001"],
  };

  it("saves and loads assessment records safely from localStorage", () => {
    saveAssessmentRecord(recordA);
    saveAssessmentRecord(recordB);

    const loaded = loadAssessmentRecords();
    expect(loaded).toHaveLength(2);
    expect(getAssessmentRecordById("rec-100")?.athleteId).toBe("ath-iker-01");
  });

  it("updates an existing assessment record in place without duplicating", () => {
    saveAssessmentRecord(recordA);
    const updated: AssessmentRecord = {
      ...recordA,
      overallNotes: "Observación técnica actualizada tras revisión",
    };
    saveAssessmentRecord(updated);

    const loaded = loadAssessmentRecords();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].overallNotes).toBe("Observación técnica actualizada tras revisión");
  });

  it("filters records by athlete pseudonym ID", () => {
    saveAssessmentRecord(recordA);
    saveAssessmentRecord(recordB);

    const ikerRecords = getAssessmentRecordsByAthlete("ath-iker-01");
    expect(ikerRecords).toHaveLength(1);
    expect(ikerRecords[0].id).toBe("rec-100");

    expect(getAssessmentRecordsByAthlete("non-existent")).toHaveLength(0);
  });

  it("discards corrupted or non-conforming data without crashing the UI", () => {
    localStorage.setItem(
      ASSESSMENT_RECORDS_STORAGE_KEY,
      JSON.stringify([{ invalid: "data" }, { ...recordA }, "not an object"])
    );

    const loaded = loadAssessmentRecords();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe("rec-100");
  });

  it("handles parse exceptions gracefully", () => {
    localStorage.setItem(ASSESSMENT_RECORDS_STORAGE_KEY, "{ corrupted JSON");
    expect(loadAssessmentRecords()).toEqual([]);
  });

  it("deletes a record and clears all records supporting right to erasure (D-021)", () => {
    saveAssessmentRecord(recordA);
    saveAssessmentRecord(recordB);

    deleteAssessmentRecord("rec-100");
    expect(loadAssessmentRecords()).toHaveLength(1);
    expect(getAssessmentRecordById("rec-100")).toBeUndefined();

    clearAllAssessmentRecords();
    expect(loadAssessmentRecords()).toEqual([]);
  });
});
