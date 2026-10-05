import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, beforeEach } from "vitest";
import { AssessmentCatalogPage } from "./AssessmentCatalogPage";
import { saveAssessmentRecord } from "../data/assessmentRecordStorage";
import type { AssessmentRecord } from "../domain/assessmentRecord";

describe("AssessmentCatalogPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the canonical evaluation EVAL-001 and empty state when no records exist", () => {
    render(
      <MemoryRouter>
        <AssessmentCatalogPage />
      </MemoryRouter>
    );

    expect(screen.getByText("EVAL-001")).toBeInTheDocument();
    expect(screen.getByText("Evaluación inicial de competencia motriz")).toBeInTheDocument();
    expect(screen.getByText("Sin registros de evaluación")).toBeInTheDocument();
  });

  it("renders saved assessment records and allows deleting one", () => {
    const record: AssessmentRecord = {
      id: "rec-test-1",
      athleteId: "ath-iker-01",
      assessmentId: "EVAL-001",
      date: "2026-10-05T10:00:00.000Z",
      taskResults: {},
      recommendedExerciseIds: ["EX-002", "EX-004"],
      overallNotes: "Buena predisposición inicial",
    };
    saveAssessmentRecord(record);

    render(
      <MemoryRouter>
        <AssessmentCatalogPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Deportista: ath-iker-01")).toBeInTheDocument();
    expect(screen.getByText("«Buena predisposición inicial»")).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", { name: "Eliminar registro de ath-iker-01" });
    fireEvent.click(deleteBtn);

    expect(screen.getByText("Registro de evaluación eliminado.")).toBeInTheDocument();
    expect(screen.getByText("Sin registros de evaluación")).toBeInTheDocument();
  });
});
