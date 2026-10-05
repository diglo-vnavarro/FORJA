import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, beforeEach } from "vitest";
import { SESSION_EXECUTIONS_STORAGE_KEY } from "@/features/session-execution/data/sessionExecutionStorage";
import { saveSessionDraft } from "@/features/session-builder/data/sessionDraftStorage";
import { createSessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { sessions } from "@/features/sessions/data/sessions";
import { SessionExecutionPage } from "./SessionExecutionPage";

const renderExecution = () =>
  render(
    <MemoryRouter initialEntries={["/sessions/execute/execute-me"]}>
      <Routes>
        <Route path="/sessions/execute/:draftId" element={<SessionExecutionPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe("SessionExecutionPage (F1-11: Modo campo)", () => {
  beforeEach(() => {
    localStorage.clear();
    saveSessionDraft(createSessionDraft(sessions[2], new Date(), "execute-me"));
  });

  it("explains missing information instead of completing an unfinished record", async () => {
    const user = userEvent.setup();
    renderExecution();
    await user.click(screen.getByRole("button", { name: "Completar sesión" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Indica el resultado de todas las tareas");
    expect(localStorage.getItem(SESSION_EXECUTIONS_STORAGE_KEY)).toBeNull();
  });

  it("completes a fully recorded session and locks its snapshot", async () => {
    const user = userEvent.setup();
    renderExecution();
    for (const select of screen.getAllByLabelText(/^Resultado de/)) {
      await user.selectOptions(select, "completed");
    }
    for (const input of screen.getAllByLabelText("Dosis realizada")) {
      await user.type(input, "2 series");
    }
    await user.selectOptions(screen.getByLabelText("RPE global de la sesión"), "6");
    await user.type(
      screen.getByLabelText("Próxima decisión del entrenador"),
      "Conservar la estructura y revisar la carga.",
    );
    await user.click(screen.getByRole("button", { name: "Completar sesión" }));
    expect(screen.getByText(/modo de solo lectura/i)).toBeInTheDocument();
    expect(screen.getByText(/instantánea de lo realizado/i)).toBeInTheDocument();
    expect(localStorage.getItem(SESSION_EXECUTIONS_STORAGE_KEY)).toContain('"status":"completed"');
  });

  it("permite registrar una tarea como hecha en un solo toque y avanza a la siguiente", async () => {
    const user = userEvent.setup();
    renderExecution();

    // Comprobar que inicia en modo campo en la tarea 1
    expect(screen.getByText(/Tarea 1 de \d+:/i)).toBeInTheDocument();

    // Registrar en un toque
    const quickButtons = screen.getAllByRole("button", { name: /Registrar .* como hecha en un toque/i });
    expect(quickButtons.length).toBeGreaterThan(0);
    await user.click(quickButtons[0]);

    // Avanza a la tarea 2
    expect(screen.getByText(/Tarea 2 de \d+:/i)).toBeInTheDocument();
    // Y el progreso se actualiza
    expect(screen.getByText(/1\/\d+ completadas/i)).toBeInTheDocument();
  });

  it("permite alternar entre modo campo y modo lista", async () => {
    const user = userEvent.setup();
    renderExecution();

    const toggleButton = screen.getByRole("button", { name: "Cambiar a modo lista" });
    await user.click(toggleButton);

    expect(screen.getByRole("button", { name: "Cambiar a modo campo" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Navegación de tareas en modo campo")).not.toBeInTheDocument();
  });

  it("permite retroceder y avanzar con los controles del stepper en modo campo", async () => {
    const user = userEvent.setup();
    renderExecution();

    const prevButton = screen.getByRole("button", { name: "Tarea anterior" });
    const nextButton = screen.getByRole("button", { name: "Siguiente tarea" });

    expect(prevButton).toBeDisabled();
    await user.click(nextButton);
    expect(screen.getByText(/Tarea 2 de \d+:/i)).toBeInTheDocument();
    expect(prevButton).not.toBeDisabled();

    await user.click(prevButton);
    expect(screen.getByText(/Tarea 1 de \d+:/i)).toBeInTheDocument();
  });
});
