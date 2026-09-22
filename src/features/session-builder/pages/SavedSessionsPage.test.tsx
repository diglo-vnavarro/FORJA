import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { saveSessionDraft } from "@/features/session-builder/data/sessionDraftStorage";
import { createSessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { sessions } from "@/features/sessions/data/sessions";
import { SavedSessionsPage } from "./SavedSessionsPage";

describe("SavedSessionsPage", () => {
  beforeEach(() => localStorage.clear());

  it("lists saved drafts and can duplicate one as a new local draft", async () => {
    const user = userEvent.setup();
    const draft = { ...createSessionDraft(sessions[1], new Date("2026-09-22T10:00:00.000Z"), "original"), title: "Sesión del martes" };
    saveSessionDraft(draft);
    render(<MemoryRouter><SavedSessionsPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Sesión del martes" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Duplicar" }));
    expect(screen.getByRole("heading", { name: "Sesión del martes (copia)" })).toBeInTheDocument();
    expect(screen.getAllByText("0/5", { exact: false })).toHaveLength(2);
  });

  it("requires an inline confirmation before deleting a draft", async () => {
    const user = userEvent.setup();
    saveSessionDraft(createSessionDraft(sessions[0], new Date(), "delete-me"));
    render(<MemoryRouter><SavedSessionsPage /></MemoryRouter>);
    await user.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(screen.getByRole("alert")).toHaveTextContent("¿Eliminar este borrador local?");
    await user.click(screen.getByRole("button", { name: "Sí, eliminar" }));
    expect(screen.getByRole("heading", { name: "Todavía no hay sesiones guardadas" })).toBeInTheDocument();
  });
});
