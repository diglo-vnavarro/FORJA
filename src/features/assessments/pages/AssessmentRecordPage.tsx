import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { TextField } from "@/components/ui/TextField";
import { getAssessmentById } from "../data/assessments";
import { saveAssessmentRecord } from "../data/assessmentRecordStorage";
import type {
  AssessmentRecord,
  TaskEvaluationCompetence,
  TaskEvaluationResult,
} from "../domain/assessmentRecord";

export function AssessmentRecordPage() {
  const { assessmentId = "" } = useParams();
  const navigate = useNavigate();
  const assessment = useMemo(() => getAssessmentById(assessmentId), [assessmentId]);

  const [athleteId, setAthleteId] = useState("ath-iker-01");
  const [overallNotes, setOverallNotes] = useState("");
  const [taskEvaluations, setTaskEvaluations] = useState<Record<string, TaskEvaluationResult>>({});
  const [errorMessage, setErrorMessage] = useState("");

  if (!assessment) {
    return (
      <div className="page">
        <EmptyState
          title="Evaluación no encontrada"
          description="La batería de evaluación solicitada no existe en el catálogo canónico."
        />
        <Link to="/assessments" className="button">
          Volver a evaluaciones
        </Link>
      </div>
    );
  }

  const handleSelectCompetence = (taskId: string, competence: TaskEvaluationCompetence) => {
    const task = assessment.tasks.find((t) => t.id === taskId);
    if (!task) return;

    let selectedExercises: `EX-${string}`[] = [];
    if (competence === "sufficient") {
      selectedExercises = task.decision.sufficient.exerciseIds;
    } else if (competence === "partial") {
      selectedExercises =
        task.decision.partial?.exerciseIds ??
        task.decision.partialOrInsufficient?.exerciseIds ??
        [];
    } else if (competence === "insufficient") {
      selectedExercises =
        task.decision.insufficient?.exerciseIds ??
        task.decision.partialOrInsufficient?.exerciseIds ??
        [];
    }

    setTaskEvaluations((prev) => ({
      ...prev,
      [taskId]: {
        taskId,
        competence,
        selectedExerciseId: selectedExercises[0],
        notes: prev[taskId]?.notes ?? "",
      },
    }));
  };

  const handleSave = () => {
    if (!athleteId.trim()) {
      setErrorMessage("Introduce un identificador o alias para el deportista.");
      return;
    }

    const allRecommendedExercises = Array.from(
      new Set(
        Object.values(taskEvaluations)
          .map((res) => res.selectedExerciseId)
          .filter((id): id is `EX-${string}` => Boolean(id))
      )
    );

    const record: AssessmentRecord = {
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      athleteId: athleteId.trim(),
      assessmentId: assessment.identity.id,
      date: new Date().toISOString(),
      taskResults: taskEvaluations,
      overallNotes: overallNotes.trim(),
      recommendedExerciseIds: allRecommendedExercises,
    };

    saveAssessmentRecord(record);
    navigate("/assessments");
  };

  return (
    <div className="page assessment-record-page">
      <PageHeader
        eyebrow={`Registro de evaluación · ${assessment.identity.id}`}
        title={assessment.identity.name}
        description={assessment.purpose}
      />

      <section className="record-athlete-section" style={{ marginBottom: "2rem" }}>
        <Card as="article">
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Identificación del deportista</h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-fg-muted)", marginBottom: "1rem" }}>
            Conforme a D-021, utiliza un alias o código técnico local sin datos personales sensibles.
          </p>

          <TextField
            label="Identificador o alias del deportista"
            value={athleteId}
            onChange={(e) => {
              setAthleteId(e.target.value);
              setErrorMessage("");
            }}
            placeholder="ej. ath-iker-01"
            error={errorMessage}
          />

          <div style={{ marginTop: "1rem" }}>
            <label
              htmlFor="overall-notes"
              style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}
            >
              Observaciones generales
            </label>
            <textarea
              id="overall-notes"
              className="form-control"
              rows={2}
              value={overallNotes}
              onChange={(e) => setOverallNotes(e.target.value)}
              placeholder="Contexto, sensaciones del deportista o incidencias durante la sesión..."
              style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}
            />
          </div>
        </Card>
      </section>

      <section className="record-tasks-section" aria-label="Tareas de la evaluación">
        <h2 className="section-title" style={{ marginBottom: "1rem" }}>
          Observación de patrones motrices ({assessment.tasks.length} tareas)
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {assessment.tasks.map((task, index) => {
            const currentEvaluation = taskEvaluations[task.id];
            const currentCompetence = currentEvaluation?.competence ?? "not_measured";

            return (
              <Card key={task.id} as="article" className="eval-task-card">
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.1rem", margin: 0 }}>
                    {index + 1}. {task.title}
                  </h3>
                  {currentCompetence !== "not_measured" && (
                    <Badge tone={currentCompetence === "sufficient" ? "green" : currentCompetence === "partial" ? "blue" : "neutral"}>
                      {currentCompetence === "sufficient" ? "Suficiente" : currentCompetence === "partial" ? "Parcial" : "Insuficiente"}
                    </Badge>
                  )}
                </header>

                <p style={{ fontSize: "0.9rem", color: "var(--color-fg-muted)", margin: "0.25rem 0" }}>
                  <strong>Objetivo:</strong> {task.objective}
                </p>
                <p style={{ fontSize: "0.9rem", margin: "0.25rem 0" }}>
                  <strong>Consigna:</strong> {task.cue}
                </p>
                <p style={{ fontSize: "0.9rem", margin: "0.25rem 0" }}>
                  <strong>Qué observar:</strong> {task.whatToObserve}
                </p>

                <div className="eval-task-criteria" style={{ marginTop: "0.75rem", padding: "0.75rem", background: "var(--color-bg-secondary, rgba(0,0,0,0.02))", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}>
                  <div><strong>Criterio suficiente:</strong> {task.criteria.sufficient}</div>
                  <div><strong>Criterio parcial:</strong> {task.criteria.partial}</div>
                  <div><strong>Criterio insuficiente:</strong> {task.criteria.insufficient}</div>
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <span style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                    Competencia observada:
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    <Button
                      variant={currentCompetence === "sufficient" ? "primary" : "secondary"}
                      onClick={() => handleSelectCompetence(task.id, "sufficient")}
                    >
                      Suficiente
                    </Button>
                    <Button
                      variant={currentCompetence === "partial" ? "primary" : "secondary"}
                      onClick={() => handleSelectCompetence(task.id, "partial")}
                    >
                      Parcial
                    </Button>
                    <Button
                      variant={currentCompetence === "insufficient" ? "primary" : "secondary"}
                      onClick={() => handleSelectCompetence(task.id, "insufficient")}
                    >
                      Insuficiente
                    </Button>
                    <Button
                      variant={currentCompetence === "not_measured" ? "primary" : "secondary"}
                      onClick={() => handleSelectCompetence(task.id, "not_measured")}
                    >
                      No medido
                    </Button>
                  </div>
                </div>

                {currentEvaluation?.selectedExerciseId && (
                  <div style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--color-primary, #0055ff)" }}>
                    <strong>Punto de entrada recomendado: </strong>
                    <Link to={`/exercises/${currentEvaluation.selectedExerciseId.toLowerCase()}`}>
                      {currentEvaluation.selectedExerciseId}
                    </Link>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <footer style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
        <Link to="/assessments" className="button button--secondary">
          Cancelar
        </Link>
        <Button variant="primary" onClick={handleSave}>
          Guardar evaluación
        </Button>
      </footer>
    </div>
  );
}
