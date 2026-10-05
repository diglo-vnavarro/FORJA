import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("renders the navigation areas unifying sessions terminology", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Sesiones" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Entrenamientos" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explorar sesiones/i })).toHaveAttribute("href", "/sessions");
  });
});
