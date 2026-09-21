import { existsSync, readFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { FORJA_ATHLETE_MASTER, visualProductionManifest } from "./visualProductionManifest";

const allowedStatuses = ["missing", "draft", "available", "approved"];
const generatedIds = ["EX-003", "EX-005", "EX-006", "EX-007", "EX-008", "EX-009", "EX-010", "EX-011", "EX-012", "EX-014", "EX-015"];

function readWebpDimensions(path: string) {
  const buffer = readFileSync(path);
  expect(buffer.toString("ascii", 0, 4)).toBe("RIFF");
  expect(buffer.toString("ascii", 8, 12)).toBe("WEBP");
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const type = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (type === "VP8X") return { width: 1 + buffer.readUIntLE(data + 4, 3), height: 1 + buffer.readUIntLE(data + 7, 3) };
    if (type === "VP8 ") return { width: buffer.readUInt16LE(data + 6) & 0x3fff, height: buffer.readUInt16LE(data + 8) & 0x3fff };
    if (type === "VP8L") {
      const bits = buffer.readUInt32LE(data + 1);
      return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
    }
    offset = data + size + (size % 2);
  }
  throw new Error(`Unsupported WebP structure: ${path}`);
}

describe("visual production manifest", () => {
  it("contains EX-001 through EX-015 in canonical order with allowed statuses", () => {
    expect(visualProductionManifest.map((entry) => entry.id)).toEqual(Array.from({ length: 15 }, (_, index) => `EX-${String(index + 1).padStart(3, "0")}`));
    for (const entry of visualProductionManifest) {
      expect(entry.slug).toBeTruthy();
      expect(entry.name).toBeTruthy();
      for (const status of [entry.briefStatus, entry.productionSpecStatus, entry.masterImageStatus, entry.thumbnailStatus, entry.infographicStatus, entry.sessionCardStatus]) expect(allowedStatuses).toContain(status);
    }
  });

  it("registers EX-002 as the official athlete reference", () => {
    expect(FORJA_ATHLETE_MASTER.referenceExercise).toBe("EX-002");
    expect(visualProductionManifest.find((entry) => entry.id === "EX-002")?.athleteMaster).toBe(true);
    expect(existsSync(resolve(process.cwd(), FORJA_ATHLETE_MASTER.standardPath))).toBe(true);
  });

  it("records final human visual approval for the complete master library", () => {
    expect(visualProductionManifest).toHaveLength(15);
    expect(visualProductionManifest.every((entry) => entry.masterImageStatus === "approved")).toBe(true);
    expect(visualProductionManifest.every((entry) => entry.visualQaStatus === "APPROVED")).toBe(true);
    expect(visualProductionManifest.filter((entry) => ["PENDING_REVIEW", "REGENERATE", "REJECTED"].includes(entry.visualQaStatus))).toEqual([]);
  });

  it("only declares available briefs and production specs that exist", () => {
    for (const entry of visualProductionManifest) {
      expect(entry.briefStatus).toBe("available");
      expect(entry.briefPath && existsSync(resolve(process.cwd(), entry.briefPath))).toBe(true);
      if (entry.productionSpecStatus === "available") expect(entry.productionSpecPath && existsSync(resolve(process.cwd(), entry.productionSpecPath))).toBe(true);
      if (entry.productionSpecStatus === "missing") expect(entry.productionSpecPath).toBeUndefined();
    }
  });

  it("declares approved masters only when physical WebP files exist in the correct exercise directory", () => {
    const approved = visualProductionManifest.filter((entry) => entry.masterImageStatus === "approved");
    expect(approved.map((entry) => entry.id)).toEqual(Array.from({ length: 15 }, (_, index) => `EX-${String(index + 1).padStart(3, "0")}`));
    for (const entry of approved) {
      const expectedDirectory = `assets/exercises/${entry.id.toLowerCase()}/`;
      expect(entry.masterImagePath?.startsWith(expectedDirectory)).toBe(true);
      expect(entry.masterImagePath?.endsWith(`ex-${entry.id.slice(3).toLowerCase()}-${entry.slug}-master.webp`)).toBe(true);
      expect(extname(entry.masterImagePath!)).toBe(".webp");
      expect(existsSync(resolve(process.cwd(), entry.masterImagePath!))).toBe(true);
      expect(readWebpDimensions(resolve(process.cwd(), entry.masterImagePath!))).toEqual({ width: 1536, height: 1024 });
    }
    for (const entry of visualProductionManifest.filter((item) => item.masterImageStatus === "missing")) expect(entry.masterImagePath).toBeUndefined();
  });

  it("keeps declared asset paths unique and physically valid", () => {
    const paths = visualProductionManifest.flatMap((entry) => [entry.briefPath, entry.productionSpecPath, entry.masterImagePath, entry.thumbnailPath, entry.infographicPath, entry.infographicReferencePath, entry.infographicV1Path, entry.sessionCardPath].filter((path): path is string => Boolean(path)));
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.filter((path) => !existsSync(resolve(process.cwd(), path)))).toEqual([]);
  });

  it("registers EX-002 derivative candidates only after physical export", () => {
    const entry = visualProductionManifest.find((item) => item.id === "EX-002")!;
    expect([entry.thumbnailStatus, entry.infographicStatus, entry.sessionCardStatus]).toEqual(["approved", "draft", "draft"]);
    expect(entry.derivativeQaStatus).toEqual({ thumbnail: "APPROVED", infographic: "PENDING_REVIEW", sessionCard: "PENDING_REVIEW" });
    for (const path of [entry.thumbnailPath, entry.infographicPath, entry.sessionCardPath]) expect(path && existsSync(resolve(process.cwd(), path))).toBe(true);
    expect(readWebpDimensions(resolve(process.cwd(), entry.thumbnailPath!))).toEqual({ width: 768, height: 512 });
    expect(readWebpDimensions(resolve(process.cwd(), entry.infographicPath!))).toEqual({ width: 1200, height: 1360 });
    expect(readWebpDimensions(resolve(process.cwd(), entry.sessionCardPath!))).toEqual({ width: 1080, height: 1350 });
    expect(entry.media.thumbnail.sourcePath).toBe(entry.thumbnailPath);
  });

  it("registers the EX-007 V2.1 infographic as a pending reusable-renderer candidate", () => {
    const entry = visualProductionManifest.find((item) => item.id === "EX-007")!;
    expect(entry.infographicStatus).toBe("draft");
    expect(entry.derivativeQaStatus).toEqual({ infographic: "PENDING_REVIEW" });
    expect(entry.infographicPath && existsSync(resolve(process.cwd(), entry.infographicPath))).toBe(true);
    expect(readWebpDimensions(resolve(process.cwd(), entry.infographicPath!))).toEqual({ width: 1200, height: 1360 });
    expect(entry.media.masterImage.phases).toEqual(["Inicio", "Apoyo", "Subida"]);
  });

  it("makes all 15 briefs and production specs or reference equivalents available", () => {
    expect(visualProductionManifest.filter((entry) => entry.briefStatus === "available")).toHaveLength(15);
    expect(visualProductionManifest.filter((entry) => entry.productionSpecStatus === "available")).toHaveLength(15);
  });

  it("does not queue exercises whose masters are already approved", () => {
    const queued = visualProductionManifest.filter((entry) => entry.productionQueueStatus === "READY_FOR_MASTER_GENERATION");
    expect(queued).toEqual([]);
  });

  it("validates athlete reference, branding rules and target paths in every new prompt", () => {
    for (const id of generatedIds) {
      const entry = visualProductionManifest.find((item) => item.id === id)!;
      const document = readFileSync(resolve(process.cwd(), entry.productionSpecPath!), "utf8");
      const prompt = document.match(/## GENERATION PROMPT\s+([\s\S]*?)\s+## NEGATIVE \/ AVOID/)?.[1] ?? "";
      const target = document.match(/## Archivo objetivo\s+`([^`]+)`/)?.[1];
      expect(prompt).toContain("THE SAME FORJA ATHLETE MASTER FROM EX-002");
      expect(prompt).toContain("plain charcoal gray technical T-shirt, black shorts, white socks, black training shoes, no logos or lettering");
      expect(prompt).not.toMatch(/(?:add|draw|generate|show|include) (?:the )?(?:FORJA|logo|symbol|emblem)/i);
      expect(target).toBe(`assets/exercises/${id.toLowerCase()}/master/ex-${id.slice(3).toLowerCase()}-${entry.slug}-master.webp`);
    }
  });

  it("keeps generated masters free from pending branding review", () => {
    expect(visualProductionManifest.every((entry) => entry.brandingReviewStatus === undefined)).toBe(true);
  });
});
