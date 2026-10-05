import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders a neutral profile placeholder without fixed personal initials", () => {
    const { container } = render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    );

    const placeholder = screen.getByLabelText("Perfil no configurado");
    expect(placeholder).toBeInTheDocument();
    expect(screen.queryByText("VN")).not.toBeInTheDocument();

    const icon = placeholder.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(container.querySelector(".profile-placeholder > span")?.textContent).toBe("");
  });
});
