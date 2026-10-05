import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ForjaIcon } from "@/design-system/forja/src/icons";
import { assessments } from "../data/assessments";
import {
  deleteAssessmentRecord,
  loadAssessmentRecords,
} from "../data/assessmentRecordStorage";
import { compareAssessmentRecords, type AssessmentRecord } from "../domain/assessmentRecord";

export function AssessmentCatalogPage() {
  const [records, setRecords] = useState<AssessmentRecord[]>(() => loadAssessmentRecords());
  const [deletedMsg, setDeletedMsg] = useState("");

  const handleDelete = (id: string) => {
    deleteAssessmentRecord(id);
    setRecords(loadAssessmentRecords());
    setDeletedMsg("Registro de evaluación eliminado.");
  };

  return (
    <div className="page assessment-catalog-page">
      <PageHeader
        eyebrow="Evaluación y seguimiento"
        title="Evaluaciones y competencia motriz"
        description="Herramientas metodológicas para determinar el punto de partida y orientar la selección inicial de tareas conforme a MET-001."
      />

      {deletedMsg && (
        <div className="callout callout--success" role="status">
          <p>{deletedMsg}</p>
        </div>
      )}

      <section className="catalog-section" aria-labelledby="eval-catalog-heading">
        <h2 id="eval-catalog-heading" className="section-title">
          Baterías canónicas disponibles
        </h2>
        <div className="card-grid">
          {assessments.map((assessment) => (
            <Card key={assessment.identity.id} as="article" className="catalog-card">
              <header className="catalog-card__header">
                <span className="code-badge">{assessment.identity.id}</span>
                <Badge tone="blue">En revisión</Badge>
              </header>
              <h3 className="catalog-card__title">{assessment.identity.name}</h3>
              <p className="catalog-card__description">{assessment.purpose}</p>

              <div className="catalog-card__meta">
                <p>
                  <strong>Pregunta operativa:</strong> {assessment.operationalQuestion}
                </p>
                <p>
                  <strong>Duración estimada:</strong> {assessment.requirements.estimatedDuration}
                </p>
                <p>
                  <strong>Tareas evaluadas:</strong> {assessment.tasks.length} patrones fundamentales
                </p>
              </div>

              <div className="catalog-card__actions" style={{ marginTop: "1rem" }}>
                <Link
                  to={`/assessments/${assessment.identity.slug}/record`}
                  className="button button--primary"
                >
                  Registrar evaluación
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="catalog-section" style={{ marginTop: "2.5rem" }} aria-labelledby="eval-records-heading">
        <div className="section-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 id="eval-records-heading" className="section-title">
            Evaluaciones registradas ({records.length})
          </h2>
          <span className="metadata-note" style={{ fontSize: "0.85rem", color: "var(--color-fg-muted)" }}>
            Almacenamiento exclusivo local (D-021)
          </span>
        </div>

        {records.length === 0 ? (
          <EmptyState
            title="Sin registros de evaluación"
            description="Aún no se ha completado ninguna evaluación de deportistas en este navegador."
          />
        ) : (
          <div className="records-list" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {records.map((record, index) => {
              const previousRecord = records[index + 1];
              const progress = previousRecord
                ? compareAssessmentRecords(previousRecord, record)
                : null;

              return (
                <Card key={record.id} as="article" className="record-item-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span className="code-badge">{record.assessmentId}</span>
                        <strong style={{ fontSize: "1.05rem" }}>Deportista: {record.athleteId}</strong>
                      </div>
                      <p style={{ margin: "0.25rem 0", fontSize: "0.875rem", color: "var(--color-fg-muted)" }}>
                        Fecha: {new Date(record.date).toLocaleDateString("es-ES", { dateStyle: "long" })}
                      </p>
                      {record.overallNotes && (
                        <p style={{ margin: "0.5rem 0", fontSize: "0.9rem" }}>
                          <em>«{record.overallNotes}»</em>
                        </p>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Button
                        variant="secondary"
                        onClick={() => handleDelete(record.id)}
                        aria-label={`Eliminar registro de ${record.athleteId}`}
                      >
                        <ForjaIcon name="close" size={16} /> Eliminar
                      </Button>
                    </div>
                  </div>

                  {progress && (
                    <div
                      className="progress-banner"
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem",
                        background: "var(--color-bg-secondary, rgba(0,0,0,0.03))",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        gap: "1.5rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      <span>
                        <strong>Progreso:</strong>
                      </span>
                      <span>🟢 Mejorados: {progress.summary.improved}</span>
                      <span>🟡 Mantenidos: {progress.summary.maintained}</span>
                      <span>🔴 En atención: {progress.summary.regressed}</span>
                    </div>
                  )}

                  <div style={{ marginTop: "0.75rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Punto de entrada recomendado: </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--color-fg-muted)" }}>
                      {record.recommendedExerciseIds.join(", ") || "Sin prescripción específica"}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
