import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { exercises } from "@/features/exercises/data/exercises";
import { getSessionById, sessions } from "./sessions";

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

  it("finds sessions by id and slug", () => {
    expect(getSessionById("SES-002")?.identity.slug).toBe("fuerza-general-carga-externa");
    expect(getSessionById("fuerza-breve-semana-futbol")?.identity.id).toBe("SES-003");
  });
});
