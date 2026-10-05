import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, beforeEach } from "vitest";
import { AthletesPage } from "./AthletesPage";
import { saveAthlete, loadAthletes } from "../data/athleteStorage";
import type { Athlete } from "../domain/athlete";

describe("AthletesPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders empty state when no athletes are registered", () => {
    render(
      <MemoryRouter>
        <AthletesPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Sin deportistas registrados")).toBeInTheDocument();
  });

  it("allows opening the form, filling alias and sport, and saving a new athlete", () => {
    render(
      <MemoryRouter>
        <AthletesPage />
      </MemoryRouter>
    );

    // Open form
    const toggleBtn = screen.getByRole("button", { name: /Nuevo deportista/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByText("Registrar deportista (D-021)")).toBeInTheDocument();

    // Fill form
    const aliasInput = screen.getByLabelText(/Alias o seudónimo de trabajo/i);
    const sportInput = screen.getByLabelText(/Deporte o disciplina principal/i);

    fireEvent.change(aliasInput, { target: { value: "Iker" } });
    fireEvent.change(sportInput, { target: { value: "Fútbol" } });

    // Save
    const saveBtn = screen.getByRole("button", { name: "Guardar deportista" });
    fireEvent.click(saveBtn);

    expect(screen.getByText("Deportista «Iker» guardado correctamente.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Iker" })).toBeInTheDocument();
    expect(screen.getByText("Fútbol")).toBeInTheDocument();

    const stored = loadAthletes();
    expect(stored).toHaveLength(1);
    expect(stored[0].alias).toBe("Iker");
  });

  it("renders an existing athlete and allows deleting it with right to erasure (D-021)", () => {
    const athlete: Athlete = {
      id: "ath-iker-test",
      alias: "Iker",
      sport: "Fútbol",
      stage: "circa_phv",
      notes: "Sub-14 en desarrollo",
      createdAt: "2026-10-01T10:00:00.000Z",
      updatedAt: "2026-10-01T10:00:00.000Z",
    };
    saveAthlete(athlete);

    render(
      <MemoryRouter>
        <AthletesPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Iker" })).toBeInTheDocument();
    expect(screen.getByText("Sub-14 en desarrollo")).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", { name: "Eliminar perfil de Iker" });
    fireEvent.click(deleteBtn);

    expect(
      screen.getByText("Perfil y datos asociados de «Iker» eliminados (D-021).")
    ).toBeInTheDocument();
    expect(screen.getByText("Sin deportistas registrados")).toBeInTheDocument();
  });
});
