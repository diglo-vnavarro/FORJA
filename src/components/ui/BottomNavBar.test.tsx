import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BottomNavBar } from "./BottomNavBar";

describe("BottomNavBar component (F1-05)", () => {
  const items = [
    { id: "dashboard", label: "Inicio", icon: <span>icon-home</span>, active: true },
    { id: "exercises", label: "Ejercicios", icon: <span>icon-exercises</span> },
    { id: "sessions", label: "Sesiones", icon: <span>icon-sessions</span> },
  ];

  it("expone role=navigation con su aria-label y marca el elemento activo con aria-current=page", () => {
    render(<BottomNavBar items={items} ariaLabel="Navegación móvil" />);

    const nav = screen.getByRole("navigation", { name: "Navegación móvil" });
    expect(nav).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);

    const activeButton = screen.getByRole("button", { name: /Inicio/i });
    expect(activeButton).toHaveAttribute("aria-current", "page");

    const otherButton = screen.getByRole("button", { name: /Ejercicios/i });
    expect(otherButton).not.toHaveAttribute("aria-current");
  });

  it("acepta foco de teclado y emite evento de clic al activarse", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    const interactiveItems = [
      { id: "exercises", label: "Ejercicios", icon: <span>icon</span>, onClick: handleClick },
    ];

    render(<BottomNavBar items={interactiveItems} />);

    const button = screen.getByRole("button", { name: /Ejercicios/i });
    button.focus();
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
