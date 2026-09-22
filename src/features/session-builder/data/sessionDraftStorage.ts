import { isSessionDraft, type SessionDraft } from "@/features/session-builder/domain/sessionDraft";

export const SESSION_DRAFT_STORAGE_KEY = "forja.session-builder.draft.v1";

export function loadSessionDraft(storage: Pick<Storage, "getItem"> = localStorage): SessionDraft | null {
  try {
    const stored = storage.getItem(SESSION_DRAFT_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return isSessionDraft(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSessionDraft(draft: SessionDraft, storage: Pick<Storage, "setItem"> = localStorage) {
  storage.setItem(SESSION_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

export function removeSessionDraft(storage: Pick<Storage, "removeItem"> = localStorage) {
  storage.removeItem(SESSION_DRAFT_STORAGE_KEY);
}
