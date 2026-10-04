import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { saveSessionDraft } from "@/features/session-builder/data/sessionDraftStorage";
import { createSessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { createForjaBackup } from "@/features/session-builder/domain/sessionBackup";
import { sessions } from "@/features/sessions/data/sessions";
import { SavedSessionsPage } from "./SavedSessionsPage";

describe("SavedSessionsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    globalThis.URL.createObjectURL = vi.fn(() => "blob:http://localhost/mock");
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  it("lists saved drafts and can duplicate one as a new local draft", async () => {
    const user = userEvent.setup();
    const draft = {
      ...createSessionDraft(sessions[1], new Date("2026-09-22T10:00:00.000Z"), "original"),
      title: "Sesión del martes",
    };
    saveSessionDraft(draft);
    render(
      <MemoryRouter>
        <SavedSessionsPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Sesión del martes" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Duplicar" }));
    expect(screen.getByRole("heading", { name: "Sesión del martes (copia)" })).toBeInTheDocument();
    expect(screen.getAllByText("0/5", { exact: false })).toHaveLength(2);
  });

  it("requires an inline confirmation before deleting a draft", async () => {
    const user = userEvent.setup();
    saveSessionDraft(createSessionDraft(sessions[0], new Date(), "delete-me"));
    render(
      <MemoryRouter>
        <SavedSessionsPage />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(screen.getByRole("alert")).toHaveTextContent("¿Eliminar este borrador local?");
    await user.click(screen.getByRole("button", { name: "Sí, eliminar" }));
    expect(screen.getByRole("heading", { name: "Todavía no hay sesiones guardadas" })).toBeInTheDocument();
  });

  it("exports stored drafts to a downloadable JSON file with feedback", async () => {
    const user = userEvent.setup();
    saveSessionDraft(createSessionDraft(sessions[0], new Date(), "draft-export"));
    render(
      <MemoryRouter>
        <SavedSessionsPage />
      </MemoryRouter>,
    );

    const exportButton = screen.getByRole("button", { name: "Exportar JSON" });
    await user.click(exportButton);

    const feedback = screen.getByRole("status");
    expect(feedback).toHaveTextContent(/Respaldo descargado: 1 borradores/);
  });

  it("imports drafts from a valid JSON backup and updates the view", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SavedSessionsPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Todavía no hay sesiones guardadas" })).toBeInTheDocument();

    const draft = {
      ...createSessionDraft(sessions[0], new Date(), "draft-imported"),
      title: "Sesión importada",
    };
    const backup = createForjaBackup([draft], []);
    const file = new File([JSON.stringify(backup)], "backup.json", {
      type: "application/json",
    });

    const fileInput = screen.getByLabelText("Seleccionar archivo JSON para importar");
    await user.upload(fileInput, file);

    expect(await screen.findByRole("heading", { name: "Sesión importada" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/Importación completada/);
  });
});
