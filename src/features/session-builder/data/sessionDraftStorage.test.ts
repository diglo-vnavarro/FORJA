import { createSessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { sessions } from "@/features/sessions/data/sessions";
import { LEGACY_SESSION_DRAFT_STORAGE_KEY, loadSessionDraftById, loadSessionDrafts, removeSessionDraft, saveSessionDraft, SESSION_DRAFTS_STORAGE_KEY } from "./sessionDraftStorage";

const createStorage = () => {
  const values = new Map<string, string>();
  return {
    values,
    storage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    },
  };
};

describe("session draft storage", () => {
  it("persists and restores a valid draft", () => {
    const { values, storage } = createStorage();
    const draft = createSessionDraft(sessions[2], new Date("2026-09-22T11:00:00.000Z"), "draft-3");
    saveSessionDraft(draft, storage);
    expect(values.has(SESSION_DRAFTS_STORAGE_KEY)).toBe(true);
    expect(loadSessionDraftById("draft-3", storage)).toEqual(draft);
  });

  it("updates and removes individual drafts without affecting the collection", () => {
    const { storage } = createStorage();
    const first = createSessionDraft(sessions[0], new Date("2026-09-22T10:00:00.000Z"), "first");
    const second = createSessionDraft(sessions[1], new Date("2026-09-22T11:00:00.000Z"), "second");
    saveSessionDraft(first, storage);
    saveSessionDraft(second, storage);
    expect(loadSessionDrafts(storage).map((draft) => draft.id)).toEqual(["second", "first"]);
    expect(removeSessionDraft("second", storage).map((draft) => draft.id)).toEqual(["first"]);
  });

  it("migrates the previous single-draft format without inventing session content", () => {
    const { values, storage } = createStorage();
    const current = createSessionDraft(sessions[0], new Date("2026-09-22T10:00:00.000Z"), "unused");
    const legacyFields = { ...current } as Record<string, unknown>;
    delete legacyFields.id;
    delete legacyFields.createdAt;
    values.set(LEGACY_SESSION_DRAFT_STORAGE_KEY, JSON.stringify({ ...legacyFields, schemaVersion: 1 }));
    const [migrated] = loadSessionDrafts(storage, new Date("2026-09-22T12:00:00.000Z"));
    expect(migrated.templateId).toBe("SES-001");
    expect(migrated.tasks).toEqual(current.tasks);
    expect(migrated.id).toMatch(/^draft-migrated-/);
  });

  it("ignores malformed persisted data", () => {
    expect(loadSessionDrafts({ getItem: () => "not-json" })).toEqual([]);
    expect(loadSessionDrafts({ getItem: () => JSON.stringify({ schemaVersion: 1 }) })).toEqual([]);
  });
});
