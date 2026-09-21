import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ExerciseCatalogPage } from "./ExerciseCatalogPage";

describe("ExerciseCatalogPage", () => {
  it("shows the canonical numeric order", () => {
    const { container } = render(<MemoryRouter><ExerciseCatalogPage /></MemoryRouter>);
    const ids = [...container.querySelectorAll(".exercise-id")].map((node) => node.textContent);
    expect(ids).toEqual(Array.from({ length: 15 }, (_, index) => `EX-${String(index + 1).padStart(3, "0")}`));
  });

  it("filters the catalog by search term", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ExerciseCatalogPage /></MemoryRouter>);
    expect(screen.getByText("Sentadilla goblet")).toBeInTheDocument();
    await user.type(screen.getByRole("searchbox", { name: "Buscar ejercicios" }), "rumano");
    expect(screen.queryByText("Sentadilla goblet")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Peso muerto rumano con mancuernas" })).toBeInTheDocument();
  });

  it("shows real images for all physically integrated masters", () => {
    const { container } = render(<MemoryRouter><ExerciseCatalogPage /></MemoryRouter>);
    expect(container.querySelectorAll(".exercise-card__media img")).toHaveLength(15);
    expect(screen.queryByRole("img", { name: /Imagen en producción para/i })).not.toBeInTheDocument();
  });
});
