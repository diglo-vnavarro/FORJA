import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { exercises } from "@/features/exercises/data/exercises";
import { parseAssessmentDocument } from "./assessmentDocumentParser";
import { assessmentDocumentProblems, assessments, getAssessmentById } from "./assessments";

describe("assessments catalog", () => {
  it("contains canonical evaluation EVAL-001 with unique slug", () => {
    expect(assessments.map((a) => a.identity.id)).toEqual(["EVAL-001"]);
    expect(new Set(assessments.map((a) => a.identity.slug)).size).toBe(assessments.length);
  });

  it("reads every assessment from its Markdown document without structural problems", () => {
    expect(assessmentDocumentProblems).toEqual([]);
    for (const assessment of assessments) {
      expect(assessment.identity.status).toBe("review");
      expect(assessment.purpose).toBeTruthy();
      expect(assessment.operationalQuestion).toContain("¿Dónde debe comenzar cada capacidad");
      expect(assessment.requirements.space).toBeTruthy();
      expect(assessment.requirements.equipment).toBeTruthy();
      expect(assessment.requirements.estimatedDuration).toBeTruthy();
      expect(assessment.requirements.warmup).toBeTruthy();
      expect(assessment.safetyAndStopCriteria.length).toBeGreaterThan(0);
      expect(assessment.tasks.length).toBe(8);
      expect(existsSync(resolve(process.cwd(), assessment.traceability.sourcePath))).toBe(true);
    }
  });

  it("resolves all referenced exercise IDs against the canonical exercise library", () => {
    const validExerciseIds = new Set(exercises.map((e) => e.identity.id));
    const allReferencedExerciseIds = assessments.flatMap((assessment) =>
      assessment.tasks.flatMap((task) => [
        ...task.decision.sufficient.exerciseIds,
        ...(task.decision.partial?.exerciseIds ?? []),
        ...(task.decision.insufficient?.exerciseIds ?? []),
        ...(task.decision.partialOrInsufficient?.exerciseIds ?? []),
      ])
    );

    expect(allReferencedExerciseIds.length).toBeGreaterThan(0);
    const missing = allReferencedExerciseIds.filter((id) => !validExerciseIds.has(id));
    expect(missing).toEqual([]);
  });

  it("defines clear criteria for sufficient, partial and insufficient in every task", () => {
    for (const assessment of assessments) {
      for (const task of assessment.tasks) {
        expect(task.criteria.sufficient).toBeTruthy();
        expect(task.criteria.partial).toBeTruthy();
        expect(task.criteria.insufficient).toBeTruthy();
        expect(task.cue).toBeTruthy();
        expect(task.whatToObserve).toBeTruthy();
      }
    }
  });

  it("finds assessments by id and slug case-insensitively", () => {
    expect(getAssessmentById("EVAL-001")?.identity.name).toBe("Evaluación inicial de competencia motriz");
    expect(getAssessmentById("eval-001")?.identity.id).toBe("EVAL-001");
    expect(getAssessmentById("evaluacion-inicial-competencia-motriz")?.identity.id).toBe("EVAL-001");
    expect(getAssessmentById("inexistente")).toBeUndefined();
  });
});

describe("assessment document parser error detection", () => {
  it("reports missing title, sections, and criteria when document is malformed", () => {
    const malformed = `
# Documento sin identificador

## Estado
borrador
`;
    const parsed = parseAssessmentDocument({
      markdown: malformed,
      slug: "malformed",
      sourcePath: "dummy.md",
    });

    expect(parsed.problems.length).toBeGreaterThan(0);
    expect(parsed.problems.some((p) => p.includes("encabezado de nivel 1"))).toBe(true);
    expect(parsed.problems.some((p) => p.includes("Propósito"))).toBe(true);
    expect(parsed.problems.some((p) => p.includes("Requisitos de aplicación"))).toBe(true);
  });
});
