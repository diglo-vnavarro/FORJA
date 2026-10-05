import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs";

describe("Tabs component (F1-05)", () => {
  const tabs = [
    { id: "execution", label: "Ejecución", content: <div>Contenido de ejecución</div> },
    { id: "coaching", label: "Criterios", content: <div>Contenido de criterios</div> },
    { id: "adaptation", label: "Adaptaciones", content: <div>Contenido de adaptaciones</div> },
  ];

  it("expone los roles tablist, tab y tabpanel con sus etiquetas", () => {
    render(<Tabs tabs={tabs} ariaLabel="Secciones del ejercicio" />);

    const tablist = screen.getByRole("tablist", { name: "Secciones del ejercicio" });
    expect(tablist).toBeInTheDocument();

    const tabButtons = screen.getAllByRole("tab");
    expect(tabButtons).toHaveLength(3);
    expect(tabButtons[0]).toHaveTextContent("Ejecución");
    expect(tabButtons[0]).toHaveAttribute("aria-selected", "true");

    const panel = screen.getByRole("tabpanel", { name: "Ejecución" });
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveTextContent("Contenido de ejecución");
  });

  it("permite cambiar de pestaña mediante clics", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Tabs tabs={tabs} onChange={handleChange} />);

    const secondTab = screen.getByRole("tab", { name: "Criterios" });
    await user.click(secondTab);

    expect(handleChange).toHaveBeenCalledWith("coaching");
    expect(secondTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Criterios" })).toHaveTextContent(
      "Contenido de criterios",
    );
  });

  it("soporta navegación por teclado con flechas y foco accesible", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} />);

    const firstTab = screen.getByRole("tab", { name: "Ejecución" });
    firstTab.focus();
    expect(firstTab).toHaveFocus();

    // Flecha derecha mueve el foco y selecciona la segunda pestaña
    await user.keyboard("{ArrowRight}");
    const secondTab = screen.getByRole("tab", { name: "Criterios" });
    expect(secondTab).toHaveFocus();
    expect(secondTab).toHaveAttribute("aria-selected", "true");

    // Flecha izquierda vuelve a la primera
    await user.keyboard("{ArrowLeft}");
    expect(firstTab).toHaveFocus();
    expect(firstTab).toHaveAttribute("aria-selected", "true");
  });
});
