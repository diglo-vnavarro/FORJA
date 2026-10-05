import {
  type ForjaBackupData,
  createForjaBackup,
  mergeBackupData,
  type MergeResult,
} from "@/features/session-builder/domain/sessionBackup";
import {
  SESSION_DRAFTS_STORAGE_KEY,
  loadSessionDrafts,
} from "@/features/session-builder/data/sessionDraftStorage";
import {
  SESSION_EXECUTIONS_STORAGE_KEY,
  loadSessionExecutions,
} from "@/features/session-execution/data/sessionExecutionStorage";

type StorageAccess = Pick<Storage, "getItem" | "setItem">;

export function exportForjaBackup(
  storage: StorageAccess = localStorage,
  now = new Date(),
): ForjaBackupData {
  const drafts = loadSessionDrafts(storage, now);
  const executions = loadSessionExecutions(storage);
  return createForjaBackup(drafts, executions, now);
}

export function importForjaBackup(
  backup: ForjaBackupData,
  storage: StorageAccess = localStorage,
  now = new Date(),
): MergeResult {
  const currentDrafts = loadSessionDrafts(storage, now);
  const currentExecutions = loadSessionExecutions(storage);

  const result = mergeBackupData(currentDrafts, currentExecutions, backup);

  storage.setItem(
    SESSION_DRAFTS_STORAGE_KEY,
    JSON.stringify({ schemaVersion: 1, items: result.drafts }),
  );
  storage.setItem(
    SESSION_EXECUTIONS_STORAGE_KEY,
    JSON.stringify({ schemaVersion: 1, items: result.executions }),
  );

  return result;
}

export function triggerBackupDownload(
  backup: ForjaBackupData,
  doc: Document = document,
): void {
  const jsonString = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = doc.createElement("a");
  const timestamp = backup.exportedAt.replace(/[:.]/g, "-");

  link.href = url;
  link.download = `forja-backup-${timestamp}.json`;
  doc.body.appendChild(link);
  link.click();
  doc.body.removeChild(link);
  URL.revokeObjectURL(url);
}
