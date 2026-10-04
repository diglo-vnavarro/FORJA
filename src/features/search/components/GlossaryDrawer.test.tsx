import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { GlossaryDrawer } from "./GlossaryDrawer";
import type { GlossaryTerm } from "@/features/search/domain/glossary";

const mockTerm: GlossaryTerm = {
  id: "glossary-1rm",
  slug: "1rm-una-repeticion-maxima",
  title: "1RM — Una repetición máxima",
  acronym: "1RM",
  category: "0–9",
  summary: "Mayor carga que una persona puede movilizar correctamente una sola vez.",
  definition: "Mayor carga que una persona puede movilizar correctamente una sola vez en un ejercicio determinado.",
  decision: "No es necesario conocer el 1RM de un joven para comenzar a entrenar.",
  seeAlso: ["Intensidad", "RIR — Repeticiones en reserva"],
  source: "SCI-002",
};

describe("GlossaryDrawer", () => {
  it("renders nothing when term is null", () => {
    const { container } = render(
      <MemoryRouter>
        <GlossaryDrawer term={null} onClose={() => {}} />
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders term details, category, acronym, decision, and sources", () => {
    render(
      <MemoryRouter>
        <GlossaryDrawer term={mockTerm} onClose={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "1RM — Una repetición máxima" })).toBeInTheDocument();
    expect(screen.getByText("Mayor carga que una persona puede movilizar correctamente una sola vez.")).toBeInTheDocument();
    expect(screen.getByText(/No es necesario conocer el 1RM/)).toBeInTheDocument();
    expect(screen.getByText(/SCI-002/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ver en el glosario completo/ })).toHaveAttribute(
      "href",
      "/glossary#1rm-una-repeticion-maxima"
    );
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <MemoryRouter>
        <GlossaryDrawer term={mockTerm} onClose={handleClose} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Cerrar glosario" }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <MemoryRouter>
        <GlossaryDrawer term={mockTerm} onClose={handleClose} />
      </MemoryRouter>
    );

    await user.keyboard("{Escape}");
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("switches to related term when seeAlso chip is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <MemoryRouter>
        <GlossaryDrawer term={mockTerm} onClose={() => {}} onSelectTerm={handleSelect} />
      </MemoryRouter>
    );

    const relatedBtn = screen.getByRole("button", { name: "Intensidad" });
    await user.click(relatedBtn);
    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringMatching(/Intensidad/i),
      })
    );
  });
});
