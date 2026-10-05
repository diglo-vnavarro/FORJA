import { isAssessmentRecord, type AssessmentRecord } from "../domain/assessmentRecord";

export const ASSESSMENT_RECORDS_STORAGE_KEY = "forja.assessments.records.v1";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function loadAssessmentRecords(storage: StorageLike = localStorage): AssessmentRecord[] {
  try {
    const raw = storage.getItem(ASSESSMENT_RECORDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isAssessmentRecord);
  } catch {
    return [];
  }
}

export function saveAssessmentRecord(
  record: AssessmentRecord,
  storage: StorageLike = localStorage
): void {
  try {
    const current = loadAssessmentRecords(storage);
    const index = current.findIndex((item) => item.id === record.id);
    const updated = index >= 0
      ? current.map((item, i) => (i === index ? record : item))
      : [record, ...current];

    storage.setItem(ASSESSMENT_RECORDS_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("No se pudo guardar el registro de evaluación:", error);
    }
  }
}

export function getAssessmentRecordById(
  id: string,
  storage: StorageLike = localStorage
): AssessmentRecord | undefined {
  return loadAssessmentRecords(storage).find((record) => record.id === id);
}

export function getAssessmentRecordsByAthlete(
  athleteId: string,
  storage: StorageLike = localStorage
): AssessmentRecord[] {
  return loadAssessmentRecords(storage).filter((record) => record.athleteId === athleteId);
}

export function deleteAssessmentRecord(
  id: string,
  storage: StorageLike = localStorage
): void {
  try {
    const current = loadAssessmentRecords(storage);
    const filtered = current.filter((item) => item.id !== id);
    storage.setItem(ASSESSMENT_RECORDS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("No se pudo eliminar el registro de evaluación:", error);
    }
  }
}

export function clearAllAssessmentRecords(storage: StorageLike = localStorage): void {
  try {
    storage.removeItem(ASSESSMENT_RECORDS_STORAGE_KEY);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("No se pudieron purgar los registros de evaluación:", error);
    }
  }
}
