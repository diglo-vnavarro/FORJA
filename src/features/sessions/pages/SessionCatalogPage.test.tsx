import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SessionCatalogPage } from "./SessionCatalogPage";

describe("SessionCatalogPage", () => {
  it("shows the three sessions in canonical order", () => {
    const { container } = render(<MemoryRouter><SessionCatalogPage /></MemoryRouter>);
    expect([...container.querySelectorAll(".session-card header > span")].map((node) => node.textContent)).toEqual(["SES-001", "SES-002", "SES-003"]);
  });

  it("filters sessions by their documented context", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SessionCatalogPage /></MemoryRouter>);
    await user.type(screen.getByRole("searchbox", { name: "Buscar sesiones" }), "fútbol");
    expect(screen.getByRole("heading", { name: "Fuerza breve compatible con una semana de fútbol" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Fuerza general con carga externa" })).not.toBeInTheDocument();
  });
});
