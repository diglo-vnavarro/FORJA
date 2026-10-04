import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, beforeEach } from "vitest";
import { saveSessionDraft } from "@/features/session-builder/data/sessionDraftStorage";
import { createSessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { sessions } from "@/features/sessions/data/sessions";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage (F1-12: Próxima acción orientada al usuario)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("muestra la tarjeta de inicio rápido cuando no hay borradores guardados", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Comienza una sesión de entrenamiento")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Preparar una sesión/i })).toBeInTheDocument();

    const stats = screen.getByLabelText("Resumen de actividad y biblioteca");
    expect(within(stats).getByText("Borradores guardados")).toBeInTheDocument();
    expect(within(stats).getByText("Ejercicios canónicos")).toBeInTheDocument();
    expect(within(stats).getByText("15")).toBeInTheDocument();
  });

  it("prioriza y muestra el último borrador guardado como próxima acción", () => {
    const draft = {
      ...createSessionDraft(sessions[0], new Date(), "draft-test-1"),
      title: "Sesión sub-16 fuerza básica",
      groupContext: "Grupo juvenil A",
    };
    draft.tasks[0].criteriaReviewed = true;
    saveSessionDraft(draft);

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Sesión sub-16 fuerza básica")).toBeInTheDocument();
    expect(screen.getByText(/Borrador en curso/i)).toBeInTheDocument();
    expect(screen.getByText(/1 de \d+ tareas revisadas/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Continuar borrador/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ejecutar en campo/i })).toBeInTheDocument();
  });

  it("muestra las 4 áreas de la plataforma y sus estados", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    const areas = screen.getByLabelText("Módulos de la plataforma");
    expect(within(areas).getByRole("link", { name: /Ejercicios/i })).toBeInTheDocument();
    expect(within(areas).getByRole("link", { name: /Entrenamientos/i })).toBeInTheDocument();
    expect(within(areas).getByRole("link", { name: /Programación/i })).toBeInTheDocument();
    expect(within(areas).getByRole("link", { name: /Atletas/i })).toBeInTheDocument();
  });
});
