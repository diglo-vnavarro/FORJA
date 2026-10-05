import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, beforeEach } from "vitest";
import { saveSessionDraft, SESSION_DRAFTS_STORAGE_KEY } from "@/features/session-builder/data/sessionDraftStorage";
import { createSessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { sessions } from "@/features/sessions/data/sessions";
import { SessionBuilderPage } from "./SessionBuilderPage";

describe("SessionBuilderPage (F1-10: Pasos claros y guardado visible)", () => {
  beforeEach(() => localStorage.clear());

  it("loads a reviewed template and saves manual changes locally", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SessionBuilderPage />
      </MemoryRouter>,
    );

    await user.selectOptions(screen.getByLabelText("Plantilla FORJA"), "SES-002");
    await user.type(screen.getByLabelText("Contexto del grupo"), "Grupo sub-16");
    await user.clear(screen.getAllByLabelText("Dosis prevista")[0]);
    await user.type(screen.getAllByLabelText("Dosis prevista")[0], "2 series competentes");
    await user.click(screen.getAllByLabelText(/He revisado la ficha seleccionada/)[0]);
    await user.click(screen.getAllByRole("button", { name: "Guardar borrador" })[0]);

    expect(screen.getAllByRole("status")[0]).toHaveTextContent("Borrador guardado");
    expect(screen.getByText("1/5 tareas con criterios revisados")).toBeInTheDocument();
    expect(localStorage.getItem(SESSION_DRAFTS_STORAGE_KEY)).toContain("Grupo sub-16");
  });

  it("keeps source quality and stop criteria visible when an exercise is changed", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SessionBuilderPage />
      </MemoryRouter>,
    );
    await user.selectOptions(screen.getAllByLabelText("Ejercicio")[0], "EX-002");
    expect(screen.getAllByText("Calidad de la tarea original").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Parar o modificar").length).toBeGreaterThan(0);
    expect(screen.getByText(/La sustitución requiere revisar también/i)).toBeInTheDocument();
    expect(screen.getByText(/Los cambios del borrador no modifican la sesión canónica/i)).toBeInTheDocument();
  });

  it("reopens a saved draft by its stable identifier", () => {
    const stored = {
      ...createSessionDraft(sessions[2], new Date(), "reopen-me"),
      groupContext: "Grupo guardado",
    };
    saveSessionDraft(stored);
    render(
      <MemoryRouter initialEntries={["/sessions/prepare/reopen-me"]}>
        <Routes>
          <Route path="/sessions/prepare/:draftId" element={<SessionBuilderPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByLabelText("Plantilla FORJA")).toHaveValue("SES-003");
    expect(screen.getByLabelText("Contexto del grupo")).toHaveValue("Grupo guardado");
  });

  it("permite navegar secuencialmente o directamente entre los pasos de preparación", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SessionBuilderPage />
      </MemoryRouter>,
    );

    // Indicador de pasos inicial
    expect(screen.getByText(/Paso 1 de 4: Plantilla/i)).toBeInTheDocument();
    const btnNext = screen.getByRole("button", { name: "Siguiente paso" });
    const btnPrev = screen.getByRole("button", { name: "Paso anterior" });

    expect(btnPrev).toBeDisabled();

    // Avanzar a paso 2
    await user.click(btnNext);
    expect(screen.getByText(/Paso 2 de 4: Contexto/i)).toBeInTheDocument();
    expect(btnPrev).not.toBeDisabled();

    // Navegar directamente a paso 4 con el botón del stepper
    const step4Button = screen.getByRole("button", { name: "04. Ficha y guardado" });
    await user.click(step4Button);
    expect(screen.getByText(/Paso 4 de 4: Resumen/i)).toBeInTheDocument();
  });

  it("muestra la barra de guardado persistente con el número de tareas revisadas y atajos", () => {
    render(
      <MemoryRouter>
        <SessionBuilderPage />
      </MemoryRouter>,
    );

    const stickyBar = screen.getByRole("toolbar", { name: "Acciones de guardado del borrador" });
    expect(stickyBar).toBeInTheDocument();
    expect(screen.getByText(/0\/\d+ revisadas/)).toBeInTheDocument();
    expect(screen.getByText(/0\/\d+ tareas con criterios revisados/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ejecutar" })).toBeInTheDocument();
  });
});
