import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { SESSION_EXECUTIONS_STORAGE_KEY } from "@/features/session-execution/data/sessionExecutionStorage";
import { saveSessionDraft } from "@/features/session-builder/data/sessionDraftStorage";
import { createSessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { sessions } from "@/features/sessions/data/sessions";
import { SessionExecutionPage } from "./SessionExecutionPage";

const renderExecution = () => render(<MemoryRouter initialEntries={["/sessions/execute/execute-me"]}><Routes><Route path="/sessions/execute/:draftId" element={<SessionExecutionPage />} /></Routes></MemoryRouter>);

describe("SessionExecutionPage", () => {
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
    for (const select of screen.getAllByLabelText(/^Resultado de/)) await user.selectOptions(select, "completed");
    for (const input of screen.getAllByLabelText("Dosis realizada")) await user.type(input, "2 series");
    await user.selectOptions(screen.getByLabelText("RPE global de la sesión"), "6");
    await user.type(screen.getByLabelText("Próxima decisión del entrenador"), "Conservar la estructura y revisar la carga.");
    await user.click(screen.getByRole("button", { name: "Completar sesión" }));
    expect(screen.getByText(/modo de solo lectura/i)).toBeInTheDocument();
    expect(screen.getByText(/instantánea de lo realizado/i)).toBeInTheDocument();
    expect(localStorage.getItem(SESSION_EXECUTIONS_STORAGE_KEY)).toContain('"status":"completed"');
  });
});
