import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { GlossaryPage } from "./GlossaryPage";

describe("GlossaryPage", () => {
  it("renders glossary header, search bar, letter filters, and term cards", () => {
    render(
      <MemoryRouter initialEntries={["/glossary"]}>
        <Routes>
          <Route path="/glossary" element={<GlossaryPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Glosario de términos" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Buscar término, sigla o definición/i)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Todos/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /1RM — Una repetición máxima/i })).toBeInTheDocument();
  });

  it("filters terms when typing in the search bar", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/glossary"]}>
        <Routes>
          <Route path="/glossary" element={<GlossaryPage />} />
        </Routes>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Buscar término, sigla o definición/i);
    await user.type(searchInput, "potencia");

    expect(screen.getByRole("heading", { name: /^Potencia/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /1RM — Una repetición máxima/i })).not.toBeInTheDocument();
  });

  it("filters terms by letter tab", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/glossary"]}>
        <Routes>
          <Route path="/glossary" element={<GlossaryPage />} />
        </Routes>
      </MemoryRouter>
    );

    const letterR = screen.getByRole("tab", { name: "R" });
    await user.click(letterR);

    expect(screen.getByRole("heading", { name: /RIR/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /^Agilidad/i })).not.toBeInTheDocument();
  });

  it("opens the glossary drawer when clicking a term card title", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/glossary"]}>
        <Routes>
          <Route path="/glossary" element={<GlossaryPage />} />
        </Routes>
      </MemoryRouter>
    );

    const termBtn = screen.getByRole("button", { name: /^1RM — Una repetición máxima$/ });
    await user.click(termBtn);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/No es necesario conocer el 1RM/i);
  });
});
