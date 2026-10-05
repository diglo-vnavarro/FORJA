import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Collapsible } from "./Collapsible";

describe("Collapsible component (F1-05)", () => {
  it("expone el botón disparador con aria-expanded=false inicialmente", () => {
    render(
      <Collapsible title="Criterios de progresión">
        <p>Detalles avanzados de progresión</p>
      </Collapsible>,
    );

    const button = screen.getByRole("button", { name: /Criterios de progresión/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("acepta foco de teclado y conmuta el estado con clic o tecla", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();

    render(
      <Collapsible title="Criterios de parada" onToggle={handleToggle}>
        <p>Detalles de detención técnica</p>
      </Collapsible>,
    );

    const button = screen.getByRole("button", { name: /Criterios de parada/i });
    button.focus();
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(handleToggle).toHaveBeenCalledWith(true);

    const region = screen.getByRole("region", { name: /Criterios de parada/i });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent("Detalles de detención técnica");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});
