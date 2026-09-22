import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { ForjaIcon } from "@/design-system/forja/src/icons";
import type { Session } from "@/features/sessions/domain/session";

export function SessionCard({ session }: { session: Session }) {
  const taskCount = session.blocks.reduce((total, block) => total + block.tasks.length, 0);
  return <article className="session-card">
    <header><span>{session.identity.id}</span><ForjaIcon name="time" size={24} /></header>
    <div className="session-card__body">
      <p className="card-kicker">{session.identity.version}</p>
      <h2><Link to={`/sessions/${session.identity.id}`}>{session.identity.name}</Link></h2>
      <p>{session.purpose}</p>
      <div className="badge-list"><Badge icon="strength" tone="blue">{session.blocks.length} bloques</Badge><Badge icon="sets">{taskCount} tareas</Badge></div>
      <div className="session-card__priority"><strong>Prioridad</strong><span>{session.primaryPriority}</span></div>
      <div className="card-footer"><span>Utilizable · primera versión</span><Link className="text-link" to={`/sessions/${session.identity.id}`}>Ver sesión <span aria-hidden="true">→</span></Link></div>
    </div>
  </article>;
}
