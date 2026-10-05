import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextField } from "./TextField";

describe("TextField component (F1-05)", () => {
  it("expone el rol de textbox y asocia la etiqueta con el campo", () => {
    render(<TextField id="username" label="Nombre de usuario" />);

    const input = screen.getByRole("textbox", { name: "Nombre de usuario" });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "username");
  });

  it("acepta foco de teclado y emite cambios al escribir", async () => {
    const user = userEvent.setup();
    render(<TextField id="search" label="Buscar" />);

    const input = screen.getByRole("textbox", { name: "Buscar" });
    input.focus();
    expect(input).toHaveFocus();

    await user.keyboard("sentadilla");
    expect(input).toHaveValue("sentadilla");
  });

  it("asocia mensajes de error accesibles con aria-invalid y role=alert", () => {
    render(
      <TextField
        id="email"
        label="Correo electrónico"
        error="El formato del correo es inválido"
      />,
    );

    const input = screen.getByRole("textbox", { name: "Correo electrónico" });
    expect(input).toHaveAttribute("aria-invalid", "true");

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("El formato del correo es inválido");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
  });
});
