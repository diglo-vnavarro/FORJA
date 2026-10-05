import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PlanningPage } from "./PlanningPage";

describe("PlanningPage (F6-02: Vista semanal de calendario deportivo)", () => {
  it("renders page header and default canonical program PROG-001", () => {
    render(
      <MemoryRouter>
        <PlanningPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Programación semanal" })).toBeInTheDocument();
    expect(
      screen.getByText(/Organización de estímulos físicos articulados con el calendario deportivo real/i)
    ).toBeInTheDocument();

    expect(screen.getByText("PROG-001")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Microciclo competitivo estándar/i })).toBeInTheDocument();
  });

  it("renders the 7-day weekly calendar with MD offsets following MET-005", () => {
    render(
      <MemoryRouter>
        <PlanningPage />
      </MemoryRouter>
    );

    const calendar = screen.getByRole("region", { name: "Calendario de la semana" });
    expect(calendar).toBeInTheDocument();

    // Check specific days and MD tags
    expect(screen.getByText("Lunes")).toBeInTheDocument();
    expect(screen.getByText("MD+1")).toBeInTheDocument();

    expect(screen.getByText("Martes")).toBeInTheDocument();
    expect(screen.getByText("MD-5")).toBeInTheDocument();

    expect(screen.getByText("Jueves")).toBeInTheDocument();
    expect(screen.getByText("MD-3")).toBeInTheDocument();

    expect(screen.getByText("Domingo")).toBeInTheDocument();
    expect(screen.getByText("MD")).toBeInTheDocument();
  });

  it("links to session details and session preparation for days with assigned sessions", () => {
    render(
      <MemoryRouter>
        <PlanningPage />
      </MemoryRouter>
    );

    const viewSes002 = screen.getByRole("link", { name: "Consultar sesión SES-002" });
    expect(viewSes002).toHaveAttribute("href", "/sessions/SES-002");

    const prepSes002 = screen.getByRole("link", { name: "Preparar sesión SES-002" });
    expect(prepSes002).toHaveAttribute("href", "/sessions/prepare?template=SES-002");
  });

  it("switches to PROG-002 when clicking its selector tab", () => {
    render(
      <MemoryRouter>
        <PlanningPage />
      </MemoryRouter>
    );

    const prog2Tab = screen.getByRole("tab", { name: /PROG-002/i });
    fireEvent.click(prog2Tab);

    expect(screen.getByRole("heading", { name: /Microciclo preparatorio de pretemporada/i })).toBeInTheDocument();
    expect(screen.getByText("PROG-002")).toBeInTheDocument();
    expect(screen.getByText("D1")).toBeInTheDocument();
    expect(screen.getByText("D4")).toBeInTheDocument();
  });

  it("displays dynamic adaptation criteria", () => {
    render(
      <MemoryRouter>
        <PlanningPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Criterios de adaptación dinámica" })).toBeInTheDocument();
    expect(screen.getByText(/Variación según minutos disputados en el partido anterior/i)).toBeInTheDocument();
    expect(screen.getByText(/Semana con fatiga acumulada o exámenes escolares/i)).toBeInTheDocument();
  });
});
