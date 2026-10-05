import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BottomSheet } from "./BottomSheet";

describe("BottomSheet component (F1-05)", () => {
  it("expone role=dialog, aria-modal=true y asocia su título como etiqueta accesible", () => {
    render(
      <BottomSheet isOpen={true} onClose={vi.fn()} title="Filtros del catálogo">
        <p>Contenido de filtros</p>
      </BottomSheet>,
    );

    const dialog = screen.getByRole("dialog", { name: "Filtros del catálogo" });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("mueve el foco al botón de cerrar al abrirse", async () => {
    render(
      <BottomSheet isOpen={true} onClose={vi.fn()} title="Filtros del catálogo">
        <button type="button">Opción 1</button>
      </BottomSheet>,
    );

    const closeButton = screen.getByRole("button", { name: "Cerrar panel" });
    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });
  });

  it("cierra el diálogo al pulsar la tecla Escape o hacer clic en el botón cerrar o scrim", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    const { rerender } = render(
      <BottomSheet isOpen={true} onClose={handleClose} title="Panel">
        <p>Contenido</p>
      </BottomSheet>,
    );

    // Escape
    await user.keyboard("{Escape}");
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Botón cerrar
    const closeButton = screen.getByRole("button", { name: "Cerrar panel" });
    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(2);

    // Scrim
    const scrim = screen.getByTestId("bottom-sheet-scrim");
    await user.click(scrim);
    expect(handleClose).toHaveBeenCalledTimes(3);

    // Cuando isOpen es false no renderiza nada
    rerender(
      <BottomSheet isOpen={false} onClose={handleClose} title="Panel">
        <p>Contenido</p>
      </BottomSheet>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
