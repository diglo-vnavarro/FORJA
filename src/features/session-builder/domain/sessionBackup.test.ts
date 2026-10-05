import { describe, it, expect } from "vitest";
import {
  isForjaBackupData,
  createForjaBackup,
  parseForjaBackup,
  mergeBackupData,
  type ForjaBackupData,
} from "./sessionBackup";
import type { SessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { createSessionExecution, type SessionExecution } from "@/features/session-execution/domain/sessionExecution";

const sampleDraft: SessionDraft = {
  id: "draft-1",
  schemaVersion: 2,
  templateId: "SES-001",
  title: "Sesión de prueba",
  groupContext: "Cadetes",
  scheduledDate: "2026-10-04",
  readinessNote: "Sin novedades",
  tasks: [],
  createdAt: "2026-10-04T10:00:00.000Z",
  updatedAt: "2026-10-04T10:00:00.000Z",
};

const sampleExecution: SessionExecution = createSessionExecution(sampleDraft, new Date("2026-10-04T11:00:00.000Z"));

describe("sessionBackup domain", () => {
  describe("isForjaBackupData", () => {
    it("validates well-formed backup objects", () => {
      const backup: ForjaBackupData = {
        app: "FORJA",
        version: 1,
        exportedAt: "2026-10-04T12:00:00.000Z",
        drafts: [sampleDraft],
        executions: [sampleExecution],
      };
      expect(isForjaBackupData(backup)).toBe(true);
    });

    it("rejects non-FORJA or corrupt payloads", () => {
      expect(isForjaBackupData(null)).toBe(false);
      expect(isForjaBackupData({})).toBe(false);
      expect(
        isForjaBackupData({
          app: "OTHER_APP",
          version: 1,
          exportedAt: "now",
          drafts: [],
          executions: [],
        }),
      ).toBe(false);
      expect(
        isForjaBackupData({
          app: "FORJA",
          version: 999,
          exportedAt: "now",
          drafts: [],
          executions: [],
        }),
      ).toBe(false);
      expect(
        isForjaBackupData({
          app: "FORJA",
          version: 1,
          exportedAt: "now",
          drafts: [{ invalid: true }],
          executions: [],
        }),
      ).toBe(false);
    });
  });

  describe("createForjaBackup", () => {
    it("creates backup with metadata and contents", () => {
      const fixedDate = new Date("2026-10-04T12:30:00.000Z");
      const backup = createForjaBackup(
        [sampleDraft],
        [sampleExecution],
        fixedDate,
      );

      expect(backup.app).toBe("FORJA");
      expect(backup.version).toBe(1);
      expect(backup.exportedAt).toBe("2026-10-04T12:30:00.000Z");
      expect(backup.drafts).toHaveLength(1);
      expect(backup.executions).toHaveLength(1);
    });
  });

  describe("parseForjaBackup", () => {
    it("parses valid JSON backup", () => {
      const backup = createForjaBackup([sampleDraft], [sampleExecution]);
      const json = JSON.stringify(backup);
      const result = parseForjaBackup(json);

      expect(result.success).toBe(true);
      expect(result.data?.drafts).toHaveLength(1);
    });

    it("returns error for invalid JSON syntax", () => {
      const result = parseForjaBackup("{ invalid json");
      expect(result.success).toBe(false);
      expect(result.error).toContain("JSON válido");
    });

    it("returns error for valid JSON with invalid schema", () => {
      const result = parseForjaBackup(JSON.stringify({ not: "a backup" }));
      expect(result.success).toBe(false);
      expect(result.error).toContain("respaldo válido");
    });
  });

  describe("mergeBackupData", () => {
    it("merges new drafts and executions without duplicating", () => {
      const existingDraft = { ...sampleDraft, id: "draft-existing" };
      const importedDraft = { ...sampleDraft, id: "draft-new" };

      const backup = createForjaBackup([importedDraft], [sampleExecution]);
      const result = mergeBackupData([existingDraft], [], backup);

      expect(result.drafts).toHaveLength(2);
      expect(result.executions).toHaveLength(1);
      expect(result.importedDraftsCount).toBe(1);
      expect(result.importedExecutionsCount).toBe(1);
    });

    it("updates existing draft if imported version is newer", () => {
      const olderDraft = {
        ...sampleDraft,
        updatedAt: "2026-10-01T10:00:00.000Z",
        title: "Título antiguo",
      };
      const newerDraft = {
        ...sampleDraft,
        updatedAt: "2026-10-04T10:00:00.000Z",
        title: "Título actualizado",
      };

      const backup = createForjaBackup([newerDraft], []);
      const result = mergeBackupData([olderDraft], [], backup);

      expect(result.drafts).toHaveLength(1);
      expect(result.drafts[0].title).toBe("Título actualizado");
      expect(result.importedDraftsCount).toBe(1);
    });
  });
});
