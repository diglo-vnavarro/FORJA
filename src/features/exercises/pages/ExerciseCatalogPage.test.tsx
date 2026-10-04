import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ExerciseCatalogPage } from "./ExerciseCatalogPage";

describe("ExerciseCatalogPage (F1-09: Filtros en hoja inferior móvil y resultados)", () => {
  it("shows the canonical numeric order", () => {
    const { container } = render(
      <MemoryRouter>
        <ExerciseCatalogPage />
      </MemoryRouter>,
    );
    const ids = [...container.querySelectorAll(".exercise-id")].map((node) => node.textContent);
    expect(ids).toEqual(Array.from({ length: 15 }, (_, index) => `EX-${String(index + 1).padStart(3, "0")}`));
  });

  it("filters the catalog by search term", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ExerciseCatalogPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Sentadilla goblet")).toBeInTheDocument();
    await user.type(screen.getByRole("searchbox", { name: "Buscar ejercicios" }), "rumano");
    expect(screen.queryByText("Sentadilla goblet")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Peso muerto rumano con mancuernas" })).toBeInTheDocument();
  });

  it("shows real images for all physically integrated masters", () => {
    const { container } = render(
      <MemoryRouter>
        <ExerciseCatalogPage />
      </MemoryRouter>,
    );
    expect(container.querySelectorAll(".exercise-card__media img")).toHaveLength(15);
    expect(screen.queryByRole("img", { name: /Imagen en producción para/i })).not.toBeInTheDocument();
  });

  it("anuncia el número de resultados dinámicamente con role=status y aria-live=polite", () => {
    render(
      <MemoryRouter>
        <ExerciseCatalogPage />
      </MemoryRouter>,
    );
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("15 ejercicios disponibles");
  });

  it("permite abrir la hoja inferior de filtros en móvil, cambiar opciones y limpiar filtros", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ExerciseCatalogPage />
      </MemoryRouter>,
    );

    const filterTrigger = screen.getByRole("button", { name: /Filtros/i });
    expect(filterTrigger).toBeInTheDocument();
    expect(filterTrigger).toHaveAttribute("aria-expanded", "false");

    // Abrir la hoja inferior
    await user.click(filterTrigger);
    expect(filterTrigger).toHaveAttribute("aria-expanded", "true");

    const dialog = screen.getByRole("dialog", { name: "Filtros de ejercicios" });
    expect(dialog).toBeInTheDocument();

    // Seleccionar filtro dentro de la hoja modal
    const dialogScope = within(dialog);
    const patternSelect = dialogScope.getByRole("combobox", { name: "Patrón" });
    await user.selectOptions(patternSelect, "hipHinge");

    // El botón de aplicar anuncia los resultados filtrados
    expect(dialogScope.getByRole("button", { name: /Ver \d+ resultados/i })).toBeInTheDocument();

    // Botón para limpiar filtros disponible
    const resetButton = dialogScope.getByRole("button", { name: "Limpiar filtros" });
    expect(resetButton).toBeInTheDocument();
    await user.click(resetButton);

    // Cerrar la hoja inferior con Escape
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(filterTrigger).toHaveAttribute("aria-expanded", "false");
  });
});
