import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { exercises } from "@/features/exercises/data/exercises";
import { SESSION_SOURCES } from "./sessionDocuments";
import { parseSessionDocument } from "./sessionDocumentParser";
import { getSessionById, sessionDocumentProblems, sessions } from "./sessions";

describe("session library", () => {
  it("contains the three pilot sessions in canonical order", () => {
    expect(sessions.map((session) => session.identity.id)).toEqual(["SES-001", "SES-002", "SES-003"]);
    expect(new Set(sessions.map((session) => session.identity.slug)).size).toBe(sessions.length);
  });

  it("resolves every exercise reference against the canonical exercise library", () => {
    const exerciseIds = new Set(exercises.map((exercise) => exercise.identity.id));
    const missing = sessions.flatMap((session) => session.blocks.flatMap((block) => block.tasks.map((task) => task.exerciseId))).filter((id) => !exerciseIds.has(id));
    expect(missing).toEqual([]);
  });

  it("keeps every session structured and traceable", () => {
    for (const session of sessions) {
      expect(session.blocks.length).toBeGreaterThan(0);
      expect(session.blocks.every((block) => block.tasks.length > 0)).toBe(true);
      expect(session.blocks.flatMap((block) => block.tasks).every((task) => task.prescription && task.quality && task.stopCriteria.length > 0)).toBe(true);
      expect(session.adaptations.map((adaptation) => adaptation.level)).toEqual(["minor", "task", "objective"]);
      expect(existsSync(resolve(process.cwd(), session.traceability.sourcePath))).toBe(true);
    }
  });

  it("reads every session from its Markdown document without structural problems", () => {
    expect(sessionDocumentProblems).toEqual([]);
    for (const session of sessions) {
      expect(session.identity.status).toBe("usable");
      expect(session.purpose && session.primaryPriority && session.usageNote).toBeTruthy();
      for (const list of [session.context.profile, session.context.weekly, session.context.resources, session.readinessChecks, session.recordAfter, session.traceability.decisions]) expect(list.length).toBeGreaterThan(0);
    }
  });

  it("keeps the block ids that saved drafts depend on", () => {
    expect(sessions.map((session) => session.blocks.map((block) => block.id))).toEqual([
      ["lower-patterns", "push-pull", "trunk-control"],
      ["lower-strength", "push-pull", "rotation-control"],
      ["unilateral-strength", "pull", "unilateral-carry"],
    ]);
  });

  it("shows the reviewed document text, not a paraphrase", () => {
    const ses001 = getSessionById("SES-001")!;
    const pushUp = ses001.blocks.flatMap((block) => block.tasks).find((task) => task.exerciseId === "EX-008")!;
    expect(pushUp.prescription).toMatch(/^Variante que permita competencia;/);
    expect(SESSION_SOURCES[0].markdown).toContain(pushUp.prescription);
  });

  it("finds sessions by id and slug", () => {
    expect(getSessionById("SES-002")?.identity.slug).toBe("fuerza-general-carga-externa");
    expect(getSessionById("fuerza-breve-semana-futbol")?.identity.id).toBe("SES-003");
  });
});

describe("session document parser", () => {
  const source = SESSION_SOURCES[0];

  it("reports a missing required section instead of rendering it empty", () => {
    const { problems } = parseSessionDocument({ ...source, markdown: source.markdown.replace("## Registro posterior", "## Registro") });
    expect(problems).toContain("SES-001: Falta la sección «Registro posterior» o está vacía.");
  });

  it("reports a task row with a missing column", () => {
    const row = source.markdown.split(/\r?\n/).find((line) => line.startsWith("| [EX-013"))!;
    const markdown = source.markdown.replace(row, row.replace(/\|[^|]+\|$/, "|  |"));
    expect(parseSessionDocument({ ...source, markdown }).problems.some((problem) => problem.includes("Bloque 3, tarea 1"))).toBe(true);
  });

  it("reports a block count that no longer matches the stable block ids", () => {
    const { problems } = parseSessionDocument({ ...source, blockIds: ["lower-patterns", "push-pull"] });
    expect(problems).toContain("SES-001: Hay 3 bloques y 2 identificadores de bloque.");
  });
});
