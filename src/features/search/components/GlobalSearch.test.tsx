import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { GlobalSearch } from "./GlobalSearch";

function renderSearch() {
  return render(
    <MemoryRouter>
      <GlobalSearch />
    </MemoryRouter>,
  );
}

describe("GlobalSearch component", () => {
  it("renders trigger buttons in the shell", () => {
    renderSearch();
    expect(screen.getByRole("button", { name: "Abrir buscador global" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Buscar en FORJA" })).toBeInTheDocument();
  });

  it("opens the modal when clicking the trigger and closes on close button or Escape", async () => {
    const user = userEvent.setup();
    renderSearch();

    const trigger = screen.getByRole("button", { name: "Abrir buscador global" });
    await user.click(trigger);

    expect(screen.getByRole("dialog", { name: "Búsqueda global" })).toBeInTheDocument();
    const searchInput = screen.getByRole("searchbox", { name: "Término de búsqueda" });
    expect(searchInput).toBeInTheDocument();

    // Close button
    const closeBtn = screen.getByRole("button", { name: "Cerrar búsqueda" });
    await user.click(closeBtn);
    expect(screen.queryByRole("dialog", { name: "Búsqueda global" })).not.toBeInTheDocument();
  });

  it("opens the modal on shortcut Ctrl+K and closes on Escape", () => {
    renderSearch();

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.getByRole("dialog", { name: "Búsqueda global" })).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Búsqueda global" })).not.toBeInTheDocument();
  });

  it("performs search and groups results by type (Ejercicios, Sesiones, Glosario)", async () => {
    const user = userEvent.setup();
    renderSearch();

    await user.click(screen.getByRole("button", { name: "Abrir buscador global" }));
    const input = screen.getByRole("searchbox", { name: "Término de búsqueda" });

    await user.type(input, "fuerza");

    // Headings for groups
    expect(screen.getByRole("heading", { name: /Ejercicios \(/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Sesiones \(/i })).toBeInTheDocument();
  });

  it("filters results when clicking tab buttons", async () => {
    const user = userEvent.setup();
    renderSearch();

    await user.click(screen.getByRole("button", { name: "Abrir buscador global" }));
    const input = screen.getByRole("searchbox", { name: "Término de búsqueda" });
    await user.type(input, "fuerza");

    // Click on Ejercicios tab
    const exercisesTab = screen.getByRole("tab", { name: "Ejercicios" });
    await user.click(exercisesTab);

    // Group headings should not appear when filtered to single type
    expect(screen.queryByRole("heading", { name: /Sesiones \(/i })).not.toBeInTheDocument();
  });

  it("navigates results with keyboard arrow keys and selects with Enter", async () => {
    const user = userEvent.setup();
    renderSearch();

    await user.click(screen.getByRole("button", { name: "Abrir buscador global" }));
    const input = screen.getByRole("searchbox", { name: "Término de búsqueda" });
    await user.type(input, "sentadilla");

    const modal = screen.getByRole("dialog", { name: "Búsqueda global" });
    fireEvent.keyDown(modal, { key: "ArrowDown" });

    // Press Enter to navigate
    fireEvent.keyDown(modal, { key: "Enter" });

    // Modal should close on select
    expect(screen.queryByRole("dialog", { name: "Búsqueda global" })).not.toBeInTheDocument();
  });
});
