import { createSessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { sessions } from "@/features/sessions/data/sessions";
import { loadSessionDraft, saveSessionDraft, SESSION_DRAFT_STORAGE_KEY } from "./sessionDraftStorage";

describe("session draft storage", () => {
  it("persists and restores a valid draft", () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
    const draft = createSessionDraft(sessions[2]);
    saveSessionDraft(draft, storage);
    expect(values.has(SESSION_DRAFT_STORAGE_KEY)).toBe(true);
    expect(loadSessionDraft(storage)).toEqual(draft);
  });

  it("ignores malformed persisted data", () => {
    expect(loadSessionDraft({ getItem: () => "not-json" })).toBeNull();
    expect(loadSessionDraft({ getItem: () => JSON.stringify({ schemaVersion: 1 }) })).toBeNull();
  });
});
