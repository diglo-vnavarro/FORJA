import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { TextField } from "@/components/ui/TextField";
import { ForjaIcon } from "@/design-system/forja/src/icons";
import {
  deleteAthlete,
  exportAthleteData,
  importAthleteData,
  loadAthletes,
  saveAthlete,
} from "../data/athleteStorage";
import type { Athlete, AthleteBiologicalStage } from "../domain/athlete";
import { getAssessmentRecordsByAthlete } from "@/features/assessments/data/assessmentRecordStorage";

const STAGE_LABELS: Record<AthleteBiologicalStage, string> = {
  pre_phv: "Pre-PHV (Antes del estirón)",
  circa_phv: "Circa-PHV (Pico de crecimiento)",
  post_phv: "Post-PHV (Consolidación)",
  unknown: "Etapa no especificada",
};

export function AthletesPage() {
  const [athletes, setAthletes] = useState<Athlete[]>(() => loadAthletes());
  const [showForm, setShowForm] = useState(false);
  const [alias, setAlias] = useState("");
  const [sport, setSport] = useState("");
  const [stage, setStage] = useState<AthleteBiologicalStage>("circa_phv");
  const [notes, setNotes] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [formError, setFormError] = useState("");

  const refreshList = () => {
    setAthletes(loadAthletes());
  };

  const handleSaveAthlete = () => {
    if (!alias.trim()) {
      setFormError("Indica un alias o seudónimo para el deportista.");
      return;
    }
    if (!sport.trim()) {
      setFormError("Indica la disciplina o deporte practicado.");
      return;
    }

    const now = new Date().toISOString();
    const id = `ath-${alias.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;

    const newAthlete: Athlete = {
      id,
      alias: alias.trim(),
      sport: sport.trim(),
      stage,
      notes: notes.trim(),
      createdAt: now,
      updatedAt: now,
    };

    saveAthlete(newAthlete);
    refreshList();
    setShowForm(false);
    setAlias("");
    setSport("");
    setNotes("");
    setFormError("");
    setStatusMessage(`Deportista «${newAthlete.alias}» guardado correctamente.`);
  };

  const handleDeleteAthlete = (athlete: Athlete) => {
    deleteAthlete(athlete.id, localStorage, true);
    refreshList();
    setStatusMessage(`Perfil y datos asociados de «${athlete.alias}» eliminados (D-021).`);
  };

  const handleExportJson = (athleteId: string, aliasName: string) => {
    const data = exportAthleteData(athleteId);
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `forja-atleta-${aliasName.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage(`Ficha y evaluaciones de «${aliasName}» exportadas.`);
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const ok = importAthleteData(parsed);
        if (ok) {
          refreshList();
          setStatusMessage("Datos del deportista importados con éxito.");
        } else {
          setFormError("El archivo no tiene el formato de exportación de FORJA (versión 1).");
        }
      } catch {
        setFormError("Error al procesar el archivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="page athletes-page">
      <PageHeader
        eyebrow="Seguimiento individual"
        title="Deportistas"
        description="Gestión local de perfiles y decisiones conforme a la directiva D-021. Almacenamiento exclusivamente en tu dispositivo, sin servidores ni datos personales sensibles."
        actions={
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Button
              variant={showForm ? "secondary" : "primary"}
              onClick={() => {
                setShowForm(!showForm);
                setFormError("");
              }}
            >
              <ForjaIcon name="bodyweight" size={16} /> {showForm ? "Cerrar formulario" : "Nuevo deportista"}
            </Button>
            <label className="button button--secondary" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
              Importar JSON
              <input
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={handleImportJson}
              />
            </label>
          </div>
        }
      />

      {statusMessage && (
        <div className="callout callout--success" role="status" style={{ marginBottom: "1.5rem" }}>
          <p>{statusMessage}</p>
        </div>
      )}

      {showForm && (
        <Card as="section" className="athlete-form-card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Registrar deportista (D-021)</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--color-fg-muted)", marginBottom: "1rem" }}>
            Los datos son estrictamente locales. Emplea únicamente un alias o identificador de trabajo.
          </p>

          {formError && (
            <div className="callout callout--error" role="alert" style={{ marginBottom: "1rem" }}>
              <p>{formError}</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <TextField
              label="Alias o seudónimo de trabajo"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="ej. Iker"
            />

            <TextField
              label="Deporte o disciplina principal"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              placeholder="ej. Fútbol, Baloncesto, Atletismo..."
            />

            <Select
              label="Etapa de maduración biológica"
              value={stage}
              onChange={(e) => setStage(e.target.value as AthleteBiologicalStage)}
              options={[
                { value: "circa_phv", label: STAGE_LABELS.circa_phv },
                { value: "pre_phv", label: STAGE_LABELS.pre_phv },
                { value: "post_phv", label: STAGE_LABELS.post_phv },
                { value: "unknown", label: STAGE_LABELS.unknown },
              ]}
            />

            <div>
              <label
                htmlFor="athlete-notes"
                style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}
              >
                Observaciones y foco de trabajo
              </label>
              <textarea
                id="athlete-notes"
                className="form-control"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Peculiaridades, molestias previas, historial deportivo..."
                style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSaveAthlete}>
                Guardar deportista
              </Button>
            </div>
          </div>
        </Card>
      )}

      <section aria-labelledby="athletes-list-heading">
        <h2 id="athletes-list-heading" className="section-title">
          Deportistas registrados ({athletes.length})
        </h2>

        {athletes.length === 0 ? (
          <EmptyState
            title="Sin deportistas registrados"
            description="Crea un perfil de trabajo con alias para vincular evaluaciones de competencia motriz y sesiones."
          />
        ) : (
          <div className="card-grid">
            {athletes.map((athlete) => {
              const evaluations = getAssessmentRecordsByAthlete(athlete.id);

              return (
                <Card key={athlete.id} as="article" className="athlete-card">
                  <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.2rem", margin: 0 }}>{athlete.alias}</h3>
                    <Badge tone="blue">{athlete.sport}</Badge>
                  </header>

                  <p style={{ fontSize: "0.875rem", margin: "0.25rem 0", color: "var(--color-fg-muted)" }}>
                    <strong>Etapa:</strong> {STAGE_LABELS[athlete.stage]}
                  </p>

                  {athlete.notes && (
                    <p style={{ fontSize: "0.875rem", margin: "0.5rem 0" }}>
                      <em>{athlete.notes}</em>
                    </p>
                  )}

                  <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--color-border)", fontSize: "0.85rem" }}>
                    <p style={{ margin: "0.25rem 0" }}>
                      <strong>Evaluaciones realizadas:</strong> {evaluations.length}
                    </p>
                  </div>

                  <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <Link
                      to="/assessments/eval-001/record"
                      className="button button--secondary"
                      style={{ fontSize: "0.85rem", padding: "0.35rem 0.65rem" }}
                    >
                      Evaluar
                    </Link>
                    <Button
                      variant="secondary"
                      onClick={() => handleExportJson(athlete.id, athlete.alias)}
                      aria-label={`Exportar datos de ${athlete.alias}`}
                    >
                      Exportar
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDeleteAthlete(athlete)}
                      aria-label={`Eliminar perfil de ${athlete.alias}`}
                    >
                      Eliminar
                    </Button>
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
