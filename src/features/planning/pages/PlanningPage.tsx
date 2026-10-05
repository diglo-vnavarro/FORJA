import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { WeeklyCalendarView } from "../components/WeeklyCalendarView";
import { programs } from "../data/programs";

export function PlanningPage() {
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    programs[0]?.id ?? "PROG-001"
  );

  const activeProgram = programs.find((p) => p.id === selectedProgramId) ?? programs[0];

  return (
    <div className="page planning-page">
      <PageHeader
        title="Programación semanal"
        description="Organización de estímulos físicos articulados con el calendario deportivo real (MET-005)."
      />

      <nav className="planning-program-nav" aria-label="Programas disponibles">
        <div className="segmented-control" role="tablist">
          {programs.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={p.id === activeProgram?.id}
              className={`button button--sm ${
                p.id === activeProgram?.id ? "button--primary" : "button--secondary"
              }`}
              onClick={() => setSelectedProgramId(p.id)}
            >
              {p.id}: {p.title.split("(")[0].trim()}
            </button>
          ))}
        </div>
      </nav>

      {activeProgram ? (
        <div className="planning-content">
          <header className="planning-header">
            <div className="planning-header__badges">
              <Badge tone="blue">{activeProgram.id}</Badge>
              <Badge tone="neutral">{activeProgram.status}</Badge>
            </div>
            <h2>{activeProgram.title}</h2>
            <p className="planning-purpose">{activeProgram.purpose}</p>
          </header>

          <Card className="planning-context-box">
            <h3>Contexto previsto</h3>
            <div className="planning-context-text">
              {activeProgram.context.split("\n").map((line, idx) => (
                <p key={idx}>{line.replace(/^-\s*/, "• ")}</p>
              ))}
            </div>
          </Card>

          <section className="planning-calendar-section" aria-labelledby="heading-calendar">
            <h3 id="heading-calendar" className="sr-only">
              Distribución del microciclo semanal
            </h3>
            <WeeklyCalendarView days={activeProgram.days} />
          </section>

          {activeProgram.adaptations.length > 0 && (
            <section className="planning-adaptations" aria-labelledby="heading-adaptations">
              <h3 id="heading-adaptations">Criterios de adaptación dinámica</h3>
              <p className="section-description">
                La planificación se modula según la exposición real, fatiga y disponibilidad
                del deportista (F-WEEK-005, F-WEEK-014).
              </p>
              <div className="adaptations-grid">
                {activeProgram.adaptations.map((adapt, idx) => (
                  <Card key={idx} className="adaptation-card">
                    <h4>{adapt.title}</h4>
                    <p>{adapt.description}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <Card>
          <p>No se encontraron programas canónicos disponibles.</p>
        </Card>
      )}
    </div>
  );
}
