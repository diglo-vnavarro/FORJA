import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { saveSessionDraft, SESSION_DRAFTS_STORAGE_KEY } from "@/features/session-builder/data/sessionDraftStorage";
import { createSessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { sessions } from "@/features/sessions/data/sessions";
import { SessionBuilderPage } from "./SessionBuilderPage";

describe("SessionBuilderPage", () => {
  beforeEach(() => localStorage.clear());

  it("loads a reviewed template and saves manual changes locally", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SessionBuilderPage /></MemoryRouter>);

    await user.selectOptions(screen.getByLabelText("Plantilla FORJA"), "SES-002");
    await user.type(screen.getByLabelText("Contexto del grupo"), "Grupo sub-16");
    await user.clear(screen.getAllByLabelText("Dosis prevista")[0]);
    await user.type(screen.getAllByLabelText("Dosis prevista")[0], "2 series competentes");
    await user.click(screen.getAllByLabelText(/He revisado la ficha seleccionada/)[0]);
    await user.click(screen.getByRole("button", { name: "Guardar borrador" }));

    expect(screen.getByRole("status")).toHaveTextContent("Borrador guardado");
    expect(screen.getByText("1/5 tareas con criterios revisados")).toBeInTheDocument();
    expect(localStorage.getItem(SESSION_DRAFTS_STORAGE_KEY)).toContain("Grupo sub-16");
  });

  it("keeps source quality and stop criteria visible when an exercise is changed", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SessionBuilderPage /></MemoryRouter>);
    await user.selectOptions(screen.getAllByLabelText("Ejercicio")[0], "EX-002");
    expect(screen.getAllByText("Calidad de la tarea original").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Parar o modificar").length).toBeGreaterThan(0);
    expect(screen.getByText(/La sustitución requiere revisar también/i)).toBeInTheDocument();
    expect(screen.getByText(/Los cambios del borrador no modifican la sesión canónica/i)).toBeInTheDocument();
  });

  it("reopens a saved draft by its stable identifier", () => {
    const stored = { ...createSessionDraft(sessions[2], new Date(), "reopen-me"), groupContext: "Grupo guardado" };
    saveSessionDraft(stored);
    render(<MemoryRouter initialEntries={["/sessions/prepare/reopen-me"]}><Routes><Route path="/sessions/prepare/:draftId" element={<SessionBuilderPage />} /></Routes></MemoryRouter>);
    expect(screen.getByLabelText("Plantilla FORJA")).toHaveValue("SES-003");
    expect(screen.getByLabelText("Contexto del grupo")).toHaveValue("Grupo guardado");
  });
});
