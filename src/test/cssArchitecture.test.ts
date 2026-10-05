import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const STYLES_DIR = resolve(process.cwd(), "src/styles");

const EXPECTED_MODULES = [
  "base.css",
  "layout.css",
  "components.css",
  "dashboard.css",
  "exercises.css",
  "sessions.css",
  "session-builder.css",
  "session-execution.css",
] as const;

describe("Arquitectura modular de estilos CSS (F1-04)", () => {
  it("global.css actúa como manifiesto e importa todos los módulos en cascada", () => {
    const globalCssPath = resolve(STYLES_DIR, "global.css");
    expect(existsSync(globalCssPath)).toBe(true);

    const content = readFileSync(globalCssPath, "utf-8");

    // Verificar que cada módulo esperado está importado con @import
    for (const mod of EXPECTED_MODULES) {
      const importStatement = `@import "./${mod}";`;
      expect(content).toContain(importStatement);
    }
  });

  it("cada archivo CSS modular existe y tiene contenido válido", () => {
    for (const mod of EXPECTED_MODULES) {
      const filePath = resolve(STYLES_DIR, mod);
      expect(existsSync(filePath), `Archivo ${mod} debe existir`).toBe(true);

      const content = readFileSync(filePath, "utf-8");
      expect(content.trim().length, `Archivo ${mod} no debe estar vacío`).toBeGreaterThan(100);
    }
  });

  it("los selectores críticos del shell y layout están presentes en layout.css y base.css", () => {
    const baseContent = readFileSync(resolve(STYLES_DIR, "base.css"), "utf-8");
    const layoutContent = readFileSync(resolve(STYLES_DIR, "layout.css"), "utf-8");

    // base.css
    expect(baseContent).toContain(":root");
    expect(baseContent).toContain(".sr-only");
    expect(baseContent).toContain(":focus-visible");

    // layout.css
    expect(layoutContent).toContain(".app-shell");
    expect(layoutContent).toContain(".app-bar");
    expect(layoutContent).toContain(".sidebar");
    expect(layoutContent).toContain(".nav-item");
    expect(layoutContent).toContain(".app-content");
    expect(layoutContent).toContain(".page-header");
  });

  it("los componentes compartidos están definidos en components.css", () => {
    const content = readFileSync(resolve(STYLES_DIR, "components.css"), "utf-8");

    expect(content).toContain(".button");
    expect(content).toContain(".button--secondary");
    expect(content).toContain(".badge");
    expect(content).toContain(".badge-list");
    expect(content).toContain(".empty-state");
    expect(content).toContain(".catalog-controls");
    expect(content).toContain(".search-control");
    expect(content).toContain(".breadcrumbs");
  });

  it("los estilos específicos de dominio están repartidos en sus módulos correspondientes", () => {
    const dashboardContent = readFileSync(resolve(STYLES_DIR, "dashboard.css"), "utf-8");
    const exercisesContent = readFileSync(resolve(STYLES_DIR, "exercises.css"), "utf-8");
    const sessionsContent = readFileSync(resolve(STYLES_DIR, "sessions.css"), "utf-8");
    const builderContent = readFileSync(resolve(STYLES_DIR, "session-builder.css"), "utf-8");
    const executionContent = readFileSync(resolve(STYLES_DIR, "session-execution.css"), "utf-8");

    // dashboard.css
    expect(dashboardContent).toContain(".dashboard-intro");
    expect(dashboardContent).toContain(".dashboard-grid");
    expect(dashboardContent).toContain(".area-card");

    // exercises.css
    expect(exercisesContent).toContain(".exercise-grid");
    expect(exercisesContent).toContain(".exercise-card");
    expect(exercisesContent).toContain(".exercise-detail");
    expect(exercisesContent).toContain(".exercise-hero");

    // sessions.css
    expect(sessionsContent).toContain(".session-grid");
    expect(sessionsContent).toContain(".session-card");
    expect(sessionsContent).toContain(".session-detail");
    expect(sessionsContent).toContain(".session-hero");

    // session-builder.css
    expect(builderContent).toContain(".builder-layout");
    expect(builderContent).toContain(".builder-editor");
    expect(builderContent).toContain(".builder-preview");
    expect(builderContent).toContain(".saved-session-grid");

    // session-execution.css
    expect(executionContent).toContain(".execution-context");
    expect(executionContent).toContain(".execution-task-list");
    expect(executionContent).toContain(".execution-complete-hero");
  });
});
