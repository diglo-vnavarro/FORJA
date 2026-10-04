import { isSessionDraft, type SessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { isSessionExecution, type SessionExecution } from "@/features/session-execution/domain/sessionExecution";

export const BACKUP_APP_IDENTIFIER = "FORJA";
export const BACKUP_SCHEMA_VERSION = 1;

export type ForjaBackupData = {
  app: typeof BACKUP_APP_IDENTIFIER;
  version: typeof BACKUP_SCHEMA_VERSION;
  exportedAt: string;
  drafts: SessionDraft[];
  executions: SessionExecution[];
};

export function isForjaBackupData(value: unknown): value is ForjaBackupData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ForjaBackupData>;

  if (candidate.app !== BACKUP_APP_IDENTIFIER) return false;
  if (candidate.version !== BACKUP_SCHEMA_VERSION) return false;
  if (typeof candidate.exportedAt !== "string") return false;
  if (!Array.isArray(candidate.drafts) || !candidate.drafts.every(isSessionDraft)) return false;
  if (!Array.isArray(candidate.executions) || !candidate.executions.every(isSessionExecution)) return false;

  return true;
}

export function createForjaBackup(
  drafts: SessionDraft[],
  executions: SessionExecution[],
  now = new Date(),
): ForjaBackupData {
  return {
    app: BACKUP_APP_IDENTIFIER,
    version: BACKUP_SCHEMA_VERSION,
    exportedAt: now.toISOString(),
    drafts: [...drafts],
    executions: [...executions],
  };
}

export function parseForjaBackup(jsonContent: string): {
  success: boolean;
  data?: ForjaBackupData;
  error?: string;
} {
  try {
    const parsed: unknown = JSON.parse(jsonContent);
    if (!isForjaBackupData(parsed)) {
      return {
        success: false,
        error: "El archivo no contiene un respaldo válido de FORJA o su formato está dañado.",
      };
    }
    return { success: true, data: parsed };
  } catch {
    return {
      success: false,
      error: "El archivo no es un JSON válido.",
    };
  }
}

export type MergeResult = {
  drafts: SessionDraft[];
  executions: SessionExecution[];
  importedDraftsCount: number;
  importedExecutionsCount: number;
};

export function mergeBackupData(
  currentDrafts: SessionDraft[],
  currentExecutions: SessionExecution[],
  backup: ForjaBackupData,
): MergeResult {
  const draftMap = new Map<string, SessionDraft>();
  currentDrafts.forEach((d) => draftMap.set(d.id, d));
  let importedDraftsCount = 0;

  for (const draft of backup.drafts) {
    const existing = draftMap.get(draft.id);
    if (!existing) {
      draftMap.set(draft.id, draft);
      importedDraftsCount += 1;
    } else if (new Date(draft.updatedAt) > new Date(existing.updatedAt)) {
      draftMap.set(draft.id, draft);
      importedDraftsCount += 1;
    }
  }

  const executionMap = new Map<string, SessionExecution>();
  currentExecutions.forEach((e) => executionMap.set(e.id, e));
  let importedExecutionsCount = 0;

  for (const exec of backup.executions) {
    const existing = executionMap.get(exec.id);
    if (!existing) {
      executionMap.set(exec.id, exec);
      importedExecutionsCount += 1;
    } else if (new Date(exec.updatedAt) > new Date(existing.updatedAt)) {
      executionMap.set(exec.id, exec);
      importedExecutionsCount += 1;
    }
  }

  const mergedDrafts = Array.from(draftMap.values()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
  const mergedExecutions = Array.from(executionMap.values()).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );

  return {
    drafts: mergedDrafts,
    executions: mergedExecutions,
    importedDraftsCount,
    importedExecutionsCount,
  };
}
