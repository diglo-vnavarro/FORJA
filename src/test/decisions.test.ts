import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("project decisions integrity", () => {
  const decisionsPath = resolve(process.cwd(), "docs/00-project/decisions.md");

  it("finds decisions.md in docs/00-project/", () => {
    expect(existsSync(decisionsPath)).toBe(true);
  });

  it("registers D-017 (DEC-A) for Phase 1 design direction", () => {
    const content = readFileSync(decisionsPath, "utf8");
    expect(content).toContain("## D-017 — Dirección de diseño de la Fase 1 (DEC-A)");
    expect(content).toContain("Patrón de navegación adaptativo");
    expect(content).toContain("Revelación progresiva en la ficha de ejercicio");
    expect(content).toContain("Catálogo de ejercicios con filtros bajo demanda");
    expect(content).toContain("Modo campo para la ejecución de sesiones");
    expect(content).toContain("Constructor de sesiones enfocado");
    expect(content).toContain("Prototipos de baja fidelidad (wireframes)");
  });
});
