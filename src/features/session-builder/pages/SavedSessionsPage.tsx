import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { duplicateSessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { loadSessionDrafts, removeSessionDraft, saveSessionDraft } from "@/features/session-builder/data/sessionDraftStorage";
import { getSessionById } from "@/features/sessions/data/sessions";

const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" });

export function SavedSessionsPage() {
  const [drafts, setDrafts] = useState(loadSessionDrafts);
  const [pendingDeletion, setPendingDeletion] = useState<string | null>(null);

  const duplicate = (id: string) => {
    const source = drafts.find((draft) => draft.id === id);
    if (!source) return;
    setDrafts(saveSessionDraft(duplicateSessionDraft(source)));
  };

  const remove = (id: string) => {
    setDrafts(removeSessionDraft(id));
    setPendingDeletion(null);
  };

  return <div className="page saved-sessions-page">
    <nav className="breadcrumbs" aria-label="Migas de pan"><Link to="/sessions">Sesiones</Link><span aria-hidden="true">/</span><span>Guardadas</span></nav>
    <PageHeader eyebrow="Trabajo local" title="Sesiones guardadas" description="Borradores preparados en este navegador. No se sincronizan con otros dispositivos ni modifican las sesiones canónicas." actions={<Link className="button" to="/sessions/prepare">Nueva sesión <span aria-hidden="true">→</span></Link>} />
    {drafts.length ? <section className="saved-session-grid" aria-label="Borradores guardados">{drafts.map((draft) => {
      const template = getSessionById(draft.templateId);
      const reviewed = draft.tasks.filter((task) => task.criteriaReviewed).length;
      return <article className="saved-session-card" key={draft.id}>
        <header><div><span>{draft.templateId} · Borrador local</span><h2><Link to={`/sessions/prepare/${draft.id}`}>{draft.title}</Link></h2></div><strong>{reviewed}/{draft.tasks.length}</strong></header>
        <dl><div><dt>Fecha prevista</dt><dd>{draft.scheduledDate || "Pendiente"}</dd></div><div><dt>Contexto</dt><dd>{draft.groupContext || "Sin especificar"}</dd></div><div><dt>Plantilla</dt><dd>{template?.identity.name ?? draft.templateId}</dd></div><div><dt>Actualizada</dt><dd>{dateFormatter.format(new Date(draft.updatedAt))}</dd></div></dl>
        <footer><Link className="text-link" to={`/sessions/prepare/${draft.id}`}>Abrir borrador</Link><Link className="text-link" to={`/sessions/execute/${draft.id}`}>Registrar ejecución</Link><button type="button" onClick={() => duplicate(draft.id)}>Duplicar</button><button className="saved-session-card__delete" type="button" onClick={() => setPendingDeletion(draft.id)}>Eliminar</button></footer>
        {pendingDeletion === draft.id && <div className="saved-session-confirm" role="alert"><p>¿Eliminar este borrador local?</p><div><button type="button" onClick={() => setPendingDeletion(null)}>Cancelar</button><button type="button" onClick={() => remove(draft.id)}>Sí, eliminar</button></div></div>}
      </article>;
    })}</section> : <><EmptyState title="Todavía no hay sesiones guardadas" description="Prepara una sesión desde una plantilla FORJA y guarda el borrador para encontrarlo aquí." /><div className="saved-sessions-empty-action"><Link className="button" to="/sessions/prepare">Preparar la primera sesión</Link></div></>}
  </div>;
}
