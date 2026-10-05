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

  it("registers D-020 (DEC-C) for Phase 2 offline strategy and service worker", () => {
    const content = readFileSync(decisionsPath, "utf8");
    expect(content).toContain("## D-020 — Funcionamiento sin conexión, estrategia de caché y aviso de actualización (DEC-C)");
    expect(content).toContain("Estrategia de Service Worker y caché offline");
    expect(content).toContain("Ciclo de vida del Service Worker y preservación de borradores");
    expect(content).toContain("Persistencia local y portabilidad de datos");
  });

  it("registers D-021 (DEC-D) for athlete data privacy and governance", () => {
    const content = readFileSync(decisionsPath, "utf8");
    expect(content).toContain("## D-021 — Privacidad y gobernanza de datos de deportistas menores de edad (DEC-D)");
    expect(content).toContain("Almacenamiento exclusivo en el cliente");
    expect(content).toContain("Minimización de datos y seudonomización");
    expect(content).toContain("Portabilidad y derecho de supresión total");
    expect(content).toContain("Separación estricta entre metodología canónica y casos personales");
  });
});

