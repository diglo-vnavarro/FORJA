import { isSessionDraft, type SessionDraft } from "@/features/session-builder/domain/sessionDraft";

export const LEGACY_SESSION_DRAFT_STORAGE_KEY = "forja.session-builder.draft.v1";
export const SESSION_DRAFTS_STORAGE_KEY = "forja.session-builder.drafts.v2";
const COLLECTION_SCHEMA_VERSION = 1;

type WritableDraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const sortByUpdatedAt = (drafts: SessionDraft[]) => [...drafts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

function migrateLegacyDraft(value: unknown, now: Date): SessionDraft | null {
  if (!value || typeof value !== "object" || (value as { schemaVersion?: unknown }).schemaVersion !== 1) return null;
  const legacy = value as Record<string, unknown>;
  const updatedAt = typeof legacy.updatedAt === "string" ? legacy.updatedAt : now.toISOString();
  const candidate = {
    ...legacy,
    schemaVersion: 2,
    id: `draft-migrated-${Date.parse(updatedAt).toString(36)}`,
    createdAt: updatedAt,
    updatedAt,
  };
  return isSessionDraft(candidate) ? candidate : null;
}

export function loadSessionDrafts(storage: Pick<Storage, "getItem"> = localStorage, now = new Date()): SessionDraft[] {
  try {
    const stored = storage.getItem(SESSION_DRAFTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as { schemaVersion?: unknown; items?: unknown };
      if (parsed.schemaVersion === COLLECTION_SCHEMA_VERSION && Array.isArray(parsed.items) && parsed.items.every(isSessionDraft)) return sortByUpdatedAt(parsed.items);
    }
    const legacy = storage.getItem(LEGACY_SESSION_DRAFT_STORAGE_KEY);
    if (!legacy) return [];
    const migrated = migrateLegacyDraft(JSON.parse(legacy) as unknown, now);
    return migrated ? [migrated] : [];
  } catch {
    return [];
  }
}

export function loadSessionDraftById(id: string, storage: Pick<Storage, "getItem"> = localStorage) {
  return loadSessionDrafts(storage).find((draft) => draft.id === id) ?? null;
}

export function saveSessionDraft(draft: SessionDraft, storage: WritableDraftStorage = localStorage) {
  const drafts = loadSessionDrafts(storage).filter((item) => item.id !== draft.id);
  const next = sortByUpdatedAt([...drafts, draft]);
  storage.setItem(SESSION_DRAFTS_STORAGE_KEY, JSON.stringify({ schemaVersion: COLLECTION_SCHEMA_VERSION, items: next }));
  storage.removeItem(LEGACY_SESSION_DRAFT_STORAGE_KEY);
  return next;
}

export function removeSessionDraft(id: string, storage: WritableDraftStorage = localStorage) {
  const next = loadSessionDrafts(storage).filter((draft) => draft.id !== id);
  storage.setItem(SESSION_DRAFTS_STORAGE_KEY, JSON.stringify({ schemaVersion: COLLECTION_SCHEMA_VERSION, items: next }));
  storage.removeItem(LEGACY_SESSION_DRAFT_STORAGE_KEY);
  return next;
}
