import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, beforeEach } from "vitest";
import { AssessmentRecordPage } from "./AssessmentRecordPage";
import { loadAssessmentRecords } from "../data/assessmentRecordStorage";

describe("AssessmentRecordPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the 8 tasks of EVAL-001 and allows selecting competence and saving", () => {
    render(
      <MemoryRouter initialEntries={["/assessments/eval-001/record"]}>
        <Routes>
          <Route path="/assessments/:assessmentId/record" element={<AssessmentRecordPage />} />
          <Route path="/assessments" element={<div>Página de evaluaciones</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Evaluación inicial de competencia motriz")).toBeInTheDocument();
    expect(screen.getByText("1. Sentadilla bipodal")).toBeInTheDocument();
    expect(screen.getByText("2. Bisagra de cadera")).toBeInTheDocument();

    // Click "Suficiente" on task 1
    const sufficientButtons = screen.getAllByRole("button", { name: "Suficiente" });
    fireEvent.click(sufficientButtons[0]);

    // Recommended exercise EX-002 should appear
    expect(screen.getByText("EX-002")).toBeInTheDocument();

    // Save evaluation
    const saveBtn = screen.getByRole("button", { name: "Guardar evaluación" });
    fireEvent.click(saveBtn);

    const saved = loadAssessmentRecords();
    expect(saved).toHaveLength(1);
    expect(saved[0].athleteId).toBe("ath-iker-01");
    expect(saved[0].recommendedExerciseIds).toContain("EX-002");
  });

  it("renders empty state for a non-existent assessment id", () => {
    render(
      <MemoryRouter initialEntries={["/assessments/inexistente/record"]}>
        <Routes>
          <Route path="/assessments/:assessmentId/record" element={<AssessmentRecordPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Evaluación no encontrada")).toBeInTheDocument();
  });
});
