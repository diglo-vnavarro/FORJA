import { sessions } from "@/features/sessions/data/sessions";
import { createSessionDraft, isSessionDraft } from "./sessionDraft";

describe("session draft", () => {
  it("creates an independent, traceable draft from a reviewed session", () => {
    const draft = createSessionDraft(sessions[1], new Date("2026-09-22T10:00:00.000Z"), "draft-test");
    expect(draft.id).toBe("draft-test");
    expect(draft.templateId).toBe("SES-002");
    expect(draft.tasks).toHaveLength(5);
    expect(draft.tasks[0]).toMatchObject({ sourceExerciseId: "EX-002", exerciseId: "EX-002", criteriaReviewed: false });
    expect(draft.updatedAt).toBe("2026-09-22T10:00:00.000Z");
    expect(draft.createdAt).toBe("2026-09-22T10:00:00.000Z");
  });

  it("rejects incomplete or incompatible stored values", () => {
    expect(isSessionDraft({ schemaVersion: 2, templateId: "SES-001" })).toBe(false);
    expect(isSessionDraft({ ...createSessionDraft(sessions[0]), schemaVersion: 3 })).toBe(false);
  });
});
