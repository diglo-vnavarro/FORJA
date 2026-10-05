import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button component (F1-05)", () => {
  it("tiene el rol de botón y expone su etiqueta accesible", () => {
    render(<Button>Guardar borrador</Button>);

    const button = screen.getByRole("button", { name: "Guardar borrador" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
  });

  it("acepta foco de teclado y responde a interacciones de clic y enter", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Acción interactiva</Button>);

    const button = screen.getByRole("button", { name: "Acción interactiva" });
    button.focus();
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it("respeta el estado deshabilitado para rol y accesibilidad", () => {
    render(<Button disabled>Deshabilitado</Button>);

    const button = screen.getByRole("button", { name: "Deshabilitado" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
  });
});
