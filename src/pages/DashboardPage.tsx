import { Link } from "react-router-dom";
import { ForjaIcon, type ForjaIconName } from "@/design-system/forja/src/icons";
import { exercises } from "@/features/exercises/data/exercises";
import { loadSessionDrafts } from "@/features/session-builder/data/sessionDraftStorage";
import { loadSessionExecutions } from "@/features/session-execution/data/sessionExecutionStorage";
import { sessions } from "@/features/sessions/data/sessions";

type Area = {
  title: string;
  description: string;
  icon: ForjaIconName;
  to: string;
  ready: boolean;
};

const areas: Area[] = [
  {
    title: "Ejercicios",
    description: "Explora tareas, prescripción y criterios de coaching.",
    icon: "strength",
    to: "/exercises",
    ready: true,
  },
  {
    title: "Sesiones",
    description: "Consulta sesiones con contexto, dosis y adaptación.",
    icon: "time",
    to: "/sessions",
    ready: true,
  },
  {
    title: "Programación",
    description: "Organización de estímulos y progresión.",
    icon: "sets",
    to: "/planning",
    ready: false,
  },
  {
    title: "Atletas",
    description: "Contexto individual y toma de decisiones.",
    icon: "bodyweight",
    to: "/athletes",
    ready: false,
  },
];

export function DashboardPage() {
  const drafts = loadSessionDrafts();
  const executions = loadSessionExecutions();
  const latestDraft = drafts[0] ?? null;
  const completedCount = executions.filter((e) => e.status === "completed").length;

  return (
    <div className="page dashboard-page">
      <header className="dashboard-hero">
        <div className="dashboard-hero__main">
          <p className="eyebrow">Panel de trabajo</p>
          <h1>Desarrollo físico en deportistas jóvenes</h1>
          <p className="page-lead">
            Toma de decisiones fundamentada en evidencia para la preparación y el entrenamiento en pista o sala.
          </p>
        </div>
      </header>

      {/* Sección principal: Próxima acción orientada al usuario */}
      <section className="dashboard-action-section" aria-label="Próxima acción recomendada">
        {latestDraft ? (
          <div className="dashboard-action-card dashboard-action-card--active">
            <div className="dashboard-action-card__badge">
              <span className="status-dot status-dot--active" /> Borrador en curso
            </div>
            <div className="dashboard-action-card__body">
              <h2>{latestDraft.title || `Sesión ${latestDraft.templateId}`}</h2>
              <p className="dashboard-action-card__meta">
                {latestDraft.scheduledDate || "Fecha pendiente"}
                {latestDraft.groupContext ? ` · ${latestDraft.groupContext}` : ""} · Basada en {latestDraft.templateId}
              </p>
              <p className="dashboard-action-card__desc">
                {latestDraft.tasks.filter((t) => t.criteriaReviewed).length} de {latestDraft.tasks.length} tareas revisadas.
                Continúa la preparación o llévala a campo para registrar la ejecución.
              </p>
            </div>
            <div className="dashboard-action-card__actions">
              <Link className="button" to={`/sessions/prepare/${latestDraft.id}`}>
                Continuar borrador <span aria-hidden="true">→</span>
              </Link>
              <Link className="button button--secondary" to={`/sessions/execute/${latestDraft.id}`}>
                Ejecutar en campo
              </Link>
            </div>
          </div>
        ) : (
          <div className="dashboard-action-card">
            <div className="dashboard-action-card__badge">
              <span className="status-dot" /> Preparación rápida
            </div>
            <div className="dashboard-action-card__body">
              <h2>Comienza una sesión de entrenamiento</h2>
              <p className="dashboard-action-card__meta">Elige una plantilla canónica y adáptala a tu grupo en 4 pasos.</p>
              <p className="dashboard-action-card__desc">
                Todas las tareas conservan la fuente científica, dosis contextuales y criterios estrictos de parada.
              </p>
            </div>
            <div className="dashboard-action-card__actions">
              <Link className="button" to="/sessions/prepare">
                Preparar una sesión <span aria-hidden="true">→</span>
              </Link>
              <Link className="button button--secondary" to="/sessions">
                Ver sesiones base
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Métricas locales y atajos rápidos */}
      <section className="dashboard-quick-stats" aria-label="Resumen de actividad y biblioteca">
        <Link to="/sessions/saved" className="quick-stat-card">
          <ForjaIcon name="time" size={24} />
          <div>
            <strong>{drafts.length}</strong>
            <span>Borradores guardados</span>
          </div>
        </Link>
        <div className="quick-stat-card">
          <ForjaIcon name="competence" size={24} />
          <div>
            <strong>{completedCount}</strong>
            <span>Sesiones ejecutadas</span>
          </div>
        </div>
        <Link to="/exercises" className="quick-stat-card">
          <ForjaIcon name="strength" size={24} />
          <div>
            <strong>{exercises.length}</strong>
            <span>Ejercicios canónicos</span>
          </div>
        </Link>
        <Link to="/sessions" className="quick-stat-card">
          <ForjaIcon name="sets" size={24} />
          <div>
            <strong>{sessions.length}</strong>
            <span>Sesiones revisadas</span>
          </div>
        </Link>
      </section>

      {/* Áreas de la plataforma */}
      <section className="dashboard-areas" aria-label="Módulos de la plataforma">
        <div className="section-heading">
          <p className="eyebrow">Exploración</p>
          <h2>Áreas de conocimiento</h2>
          <p>Consulta el catálogo de ejercicios y las sesiones completas estructuradas.</p>
        </div>
        <div className="dashboard-grid">
          {areas.map((area) => (
            <Link to={area.to} className="area-card" key={area.title}>
              <ForjaIcon name={area.icon} size={28} />
              <div>
                <span>{area.ready ? "Disponible" : "Próximamente"}</span>
                <h2>{area.title}</h2>
                <p>{area.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
