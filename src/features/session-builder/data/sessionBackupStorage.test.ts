import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  exportForjaBackup,
  importForjaBackup,
  triggerBackupDownload,
} from "./sessionBackupStorage";
import {
  SESSION_DRAFTS_STORAGE_KEY,
  saveSessionDraft,
} from "@/features/session-builder/data/sessionDraftStorage";
import {
  SESSION_EXECUTIONS_STORAGE_KEY,
  saveSessionExecution,
} from "@/features/session-execution/data/sessionExecutionStorage";
import type { SessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { createSessionExecution, type SessionExecution } from "@/features/session-execution/domain/sessionExecution";

const sampleDraft: SessionDraft = {
  id: "draft-test-1",
  schemaVersion: 2,
  templateId: "SES-001",
  title: "Sesión fuerza básica",
  groupContext: "Infantil",
  scheduledDate: "2026-10-05",
  readinessNote: "Todo correcto",
  tasks: [],
  createdAt: "2026-10-04T10:00:00.000Z",
  updatedAt: "2026-10-04T10:00:00.000Z",
};

const sampleExecution: SessionExecution = createSessionExecution(sampleDraft, new Date("2026-10-04T11:00:00.000Z"));

describe("sessionBackupStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("exports stored drafts and executions into ForjaBackupData", () => {
    saveSessionDraft(sampleDraft);
    saveSessionExecution(sampleExecution);

    const backup = exportForjaBackup(localStorage, new Date("2026-10-04T12:00:00.000Z"));

    expect(backup.app).toBe("FORJA");
    expect(backup.version).toBe(1);
    expect(backup.drafts).toHaveLength(1);
    expect(backup.drafts[0].id).toBe("draft-test-1");
    expect(backup.executions).toHaveLength(1);
    expect(backup.executions[0].id).toBe("execution-draft-test-1");
  });

  it("imports backup data and persists it in localStorage schemas", () => {
    const backup = {
      app: "FORJA" as const,
      version: 1 as const,
      exportedAt: "2026-10-04T12:00:00.000Z",
      drafts: [sampleDraft],
      executions: [sampleExecution],
    };

    const result = importForjaBackup(backup);

    expect(result.importedDraftsCount).toBe(1);
    expect(result.importedExecutionsCount).toBe(1);

    const savedDraftsRaw = localStorage.getItem(SESSION_DRAFTS_STORAGE_KEY);
    expect(savedDraftsRaw).toContain("draft-test-1");

    const savedExecsRaw = localStorage.getItem(SESSION_EXECUTIONS_STORAGE_KEY);
    expect(savedExecsRaw).toContain("execution-draft-test-1");
  });

  it("triggers backup download with simulated document anchor", () => {
    const backup = {
      app: "FORJA" as const,
      version: 1 as const,
      exportedAt: "2026-10-04T12-00-00",
      drafts: [sampleDraft],
      executions: [],
    };

    const clickMock = vi.fn();
    const mockAnchor = {
      set href(val: string) {},
      set download(val: string) {},
      click: clickMock,
    };

    const appendChildMock = vi.fn();
    const removeChildMock = vi.fn();
    const mockDoc = {
      createElement: vi.fn(() => mockAnchor),
      body: {
        appendChild: appendChildMock,
        removeChild: removeChildMock,
      },
    } as unknown as Document;

    globalThis.URL.createObjectURL = vi.fn(() => "blob:http://localhost/mock");
    globalThis.URL.revokeObjectURL = vi.fn();

    triggerBackupDownload(backup, mockDoc);

    expect(mockDoc.createElement).toHaveBeenCalledWith("a");
    expect(appendChildMock).toHaveBeenCalledWith(mockAnchor);
    expect(clickMock).toHaveBeenCalled();
    expect(removeChildMock).toHaveBeenCalledWith(mockAnchor);
  });
});
