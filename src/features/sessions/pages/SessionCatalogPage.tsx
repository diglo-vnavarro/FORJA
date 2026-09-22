import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/ui/FormControls";
import { PageHeader } from "@/components/ui/PageHeader";
import { SessionCard } from "@/features/sessions/components/SessionCard";
import { sessions } from "@/features/sessions/data/sessions";

export function SessionCatalogPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    if (!normalized) return sessions;
    return sessions.filter((session) => [session.identity.id, session.identity.name, session.purpose, session.primaryPriority, ...session.secondaryObjectives].join(" ").toLocaleLowerCase("es").includes(normalized));
  }, [query]);

  return <div className="page">
    <PageHeader eyebrow="Biblioteca de aplicación" title="Sesiones" description="Sesiones base con contexto, prioridad, dosis, adaptaciones y criterios de parada trazables." actions={<Link className="button" to="/sessions/prepare">Preparar sesión <span aria-hidden="true">→</span></Link>} />
    <section className="session-catalog-controls" aria-label="Búsqueda de sesiones"><SearchInput value={query} onChange={(event) => setQuery(event.target.value)} label="Buscar sesiones" placeholder="Buscar sesiones" /></section>
    <div className="result-summary" aria-live="polite"><strong>{filtered.length}</strong> {filtered.length === 1 ? "sesión" : "sesiones"}<span>3 fichas utilizables · primera versión</span></div>
    {filtered.length ? <section className="session-grid" aria-label="Resultados">{filtered.map((session) => <SessionCard key={session.identity.id} session={session} />)}</section> : <EmptyState title="No hay coincidencias" description="Prueba con otro término de búsqueda." />}
  </div>;
}
