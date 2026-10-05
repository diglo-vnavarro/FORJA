import {
  isAthlete,
  isAthleteExportData,
  type Athlete,
  type AthleteExportData,
} from "../domain/athlete";
import {
  getAssessmentRecordsByAthlete,
  loadAssessmentRecords,
  saveAssessmentRecord,
  ASSESSMENT_RECORDS_STORAGE_KEY,
} from "@/features/assessments/data/assessmentRecordStorage";
import {
  loadSessionExecutions,
  saveSessionExecution,
} from "@/features/session-execution/data/sessionExecutionStorage";

export const ATHLETES_STORAGE_KEY = "forja.athletes.v1";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function loadAthletes(storage: StorageLike = localStorage): Athlete[] {
  try {
    const raw = storage.getItem(ATHLETES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isAthlete);
  } catch {
    return [];
  }
}

export function saveAthlete(athlete: Athlete, storage: StorageLike = localStorage): void {
  try {
    const current = loadAthletes(storage);
    const index = current.findIndex((item) => item.id === athlete.id);
    const updated = index >= 0
      ? current.map((item, i) => (i === index ? athlete : item))
      : [athlete, ...current];

    storage.setItem(ATHLETES_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("No se pudo guardar el deportista:", error);
    }
  }
}

export function getAthleteById(
  id: string,
  storage: StorageLike = localStorage
): Athlete | undefined {
  return loadAthletes(storage).find((athlete) => athlete.id === id);
}

export function deleteAthlete(
  id: string,
  storage: StorageLike = localStorage,
  deleteAssociatedData = true
): void {
  try {
    const current = loadAthletes(storage);
    const filtered = current.filter((item) => item.id !== id);
    storage.setItem(ATHLETES_STORAGE_KEY, JSON.stringify(filtered));

    if (deleteAssociatedData) {
      // Borrado de evaluaciones asociadas (derecho de supresión D-021)
      const allRecords = loadAssessmentRecords(storage);
      const remainingRecords = allRecords.filter((rec) => rec.athleteId !== id);
      storage.setItem(ASSESSMENT_RECORDS_STORAGE_KEY, JSON.stringify(remainingRecords));
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("No se pudo eliminar el deportista:", error);
    }
  }
}

export function exportAthleteData(
  athleteId: string,
  storage: StorageLike = localStorage
): AthleteExportData | null {
  const athlete = getAthleteById(athleteId, storage);
  if (!athlete) return null;

  const evaluations = getAssessmentRecordsByAthlete(athleteId, storage);
  const allExecutions = loadSessionExecutions(storage);
  const sessionExecutions = allExecutions.filter(
    (exec) =>
      exec.groupContext?.includes(athleteId) ||
      exec.observations?.includes(athleteId) ||
      exec.nextDecision?.includes(athleteId)
  );

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    athlete,
    evaluations,
    sessionExecutions,
  };
}

export function importAthleteData(
  data: unknown,
  storage: StorageLike = localStorage
): boolean {
  if (!isAthleteExportData(data)) {
    return false;
  }

  saveAthlete(data.athlete, storage);

  for (const evaluation of data.evaluations) {
    saveAssessmentRecord(evaluation, storage);
  }

  for (const execution of data.sessionExecutions) {
    saveSessionExecution(execution, storage);
  }

  return true;
}

export function clearAllAthletes(storage: StorageLike = localStorage): void {
  try {
    storage.removeItem(ATHLETES_STORAGE_KEY);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("No se pudieron purgar los datos de deportistas:", error);
    }
  }
}
