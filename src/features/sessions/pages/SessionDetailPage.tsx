import { Link, useParams } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { ForjaIcon, type ForjaIconName } from "@/design-system/forja/src/icons";
import { getExerciseById } from "@/features/exercises/data/exercises";
import { getSessionById } from "@/features/sessions/data/sessions";

function ItemList({ items }: { items: string[] }) { return <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>; }
function InfoPanel({ title, icon, items }: { title: string; icon: ForjaIconName; items: string[] }) { if (!items.length) return null; return <section className="session-info-panel"><h3><ForjaIcon name={icon} size={21} />{title}</h3><ItemList items={items} /></section>; }

export function SessionDetailPage() {
  const { sessionId = "" } = useParams();
  const session = getSessionById(sessionId);
  if (!session) return <div className="page"><EmptyState title="Sesión no encontrada" description="El identificador solicitado no existe entre las sesiones utilizables." /><Link className="button" to="/sessions">Volver a sesiones</Link></div>;

  return <article className="page session-detail">
    <nav className="breadcrumbs" aria-label="Migas de pan"><Link to="/sessions">Sesiones</Link><span aria-hidden="true">/</span><span>{session.identity.id}</span></nav>
    <header className="session-hero">
      <div><p className="eyebrow">{session.identity.id} · {session.identity.version}</p><h1>{session.identity.name}</h1><p className="hero-objective">{session.purpose}</p></div>
      <div className="session-hero__priority"><ForjaIcon name="strength" size={28} /><span>Prioridad principal</span><strong>{session.primaryPriority}</strong></div>
    </header>

    <section className="session-summary" aria-label="Resumen de la sesión"><div><span>Estado</span><strong>Utilizable</strong></div><div><span>Bloques</span><strong>{session.blocks.length}</strong></div><div><span>Tareas</span><strong>{session.blocks.reduce((total, block) => total + block.tasks.length, 0)}</strong></div><div><span>Fuente</span><strong>SES-STD-001</strong></div></section>

    <section className="detail-section"><div className="section-heading"><p className="eyebrow">Antes de empezar</p><h2>Contexto y preparación</h2><p>La sesión solo se interpreta dentro del contexto que declara.</p></div><div className="session-info-grid"><InfoPanel title="Perfil y requisitos" icon="bodyweight" items={[...session.context.audience, ...session.context.requirements]} /><InfoPanel title="Relación semanal" icon="time" items={session.context.weeklyConsiderations} /><InfoPanel title="Recursos" icon="sets" items={session.context.resources} /><InfoPanel title="Comprobación inicial" icon="observe" items={session.readinessChecks} /></div></section>

    <section className="detail-section"><div className="section-heading"><p className="eyebrow">Estructura</p><h2>Bloques y tareas</h2><p>Cada tarea enlaza con su ficha de ejercicio y conserva dosis, calidad, adaptación y parada.</p></div><div className="session-blocks">{session.blocks.map((block, blockIndex) => <section className="session-block" key={block.id}><header><span>{String(blockIndex + 1).padStart(2, "0")}</span><div><h3>{block.name}</h3><p>{block.purpose}</p></div></header><div className="session-tasks">{block.tasks.map((task) => { const exercise = getExerciseById(task.exerciseId); return <article className="session-task" key={task.exerciseId}><div className="session-task__identity"><span>{task.exerciseId}</span><h4><Link to={`/exercises/${task.exerciseId}`}>{exercise?.identity.displayName ?? task.exerciseId}</Link></h4></div><div><strong>Prescripción contextual</strong><p>{task.prescription}</p></div><div><strong>Calidad</strong><p>{task.quality}</p></div><div><strong>Adaptar</strong><ItemList items={task.adaptations} /></div><div><strong>Parar o modificar</strong><ItemList items={task.stopCriteria} /></div></article>; })}</div></section>)}</div></section>

    <section className="detail-section"><div className="section-heading"><p className="eyebrow">Decisión en directo</p><h2>Adaptaciones globales</h2></div><div className="session-adaptation-grid">{session.adaptations.map((adaptation) => <section key={adaptation.level} className={`session-adaptation session-adaptation--${adaptation.level}`}><h3>{adaptation.label}</h3><ItemList items={adaptation.items} /></section>)}</div></section>

    <section className="detail-section"><div className="section-heading"><p className="eyebrow">Seguimiento</p><h2>Qué registrar</h2><p>Solo información que pueda cambiar una decisión futura.</p></div><div className="session-info-grid"><InfoPanel title="Después de la sesión" icon="sets" items={session.recordAfter} /><InfoPanel title="Decisiones relacionadas" icon="observe" items={session.traceability.decisions} /></div><p className="session-usage-note"><ForjaIcon name="modifyTask" size={20} />{session.usageNote}</p></section>
  </article>;
}
