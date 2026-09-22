import { isSessionExecution, type SessionExecution } from "@/features/session-execution/domain/sessionExecution";

export const SESSION_EXECUTIONS_STORAGE_KEY = "forja.session-executions.v1";
const COLLECTION_SCHEMA_VERSION = 1;
type ExecutionStorage = Pick<Storage, "getItem" | "setItem">;

const sortExecutions = (items: SessionExecution[]) => [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

export function loadSessionExecutions(storage: Pick<Storage, "getItem"> = localStorage): SessionExecution[] {
  try {
    const stored = storage.getItem(SESSION_EXECUTIONS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as { schemaVersion?: unknown; items?: unknown };
    if (parsed.schemaVersion !== COLLECTION_SCHEMA_VERSION || !Array.isArray(parsed.items) || !parsed.items.every(isSessionExecution)) return [];
    return sortExecutions(parsed.items);
  } catch {
    return [];
  }
}

export function loadExecutionByDraftId(draftId: string, storage: Pick<Storage, "getItem"> = localStorage) {
  return loadSessionExecutions(storage).find((execution) => execution.sourceDraftId === draftId) ?? null;
}

export function saveSessionExecution(execution: SessionExecution, storage: ExecutionStorage = localStorage) {
  const current = loadSessionExecutions(storage).filter((item) => item.id !== execution.id);
  const next = sortExecutions([...current, execution]);
  storage.setItem(SESSION_EXECUTIONS_STORAGE_KEY, JSON.stringify({ schemaVersion: COLLECTION_SCHEMA_VERSION, items: next }));
  return next;
}
