import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

describe("Select component (F1-05)", () => {
  const options = [
    { value: "all", label: "Todos los patrones" },
    { value: "squat", label: "Sentadilla" },
    { value: "hinge", label: "Bisagra de cadera" },
  ];

  it("expone el rol de combobox y asocia la etiqueta con el selector", () => {
    render(<Select id="pattern-filter" label="Patrón motor" options={options} />);

    const select = screen.getByRole("combobox", { name: "Patrón motor" });
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute("id", "pattern-filter");
  });

  it("acepta foco de teclado y emite eventos de cambio al seleccionar", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Select id="pattern-filter" label="Patrón motor" options={options} onChange={handleChange} />);

    const select = screen.getByRole("combobox", { name: "Patrón motor" });
    select.focus();
    expect(select).toHaveFocus();

    await user.selectOptions(select, "squat");
    expect(handleChange).toHaveBeenCalled();
    expect(select).toHaveValue("squat");
  });

  it("soporta estado de error accesible con role=alert", () => {
    render(
      <Select
        id="pattern"
        label="Patrón motor"
        options={options}
        error="Debe seleccionar un patrón"
      />,
    );

    const select = screen.getByRole("combobox", { name: "Patrón motor" });
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Debe seleccionar un patrón");
  });
});
