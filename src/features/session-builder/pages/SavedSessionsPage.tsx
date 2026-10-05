import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { duplicateSessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { loadSessionDrafts, removeSessionDraft, saveSessionDraft } from "@/features/session-builder/data/sessionDraftStorage";
import { getSessionById } from "@/features/sessions/data/sessions";
import {
  exportForjaBackup,
  importForjaBackup,
  triggerBackupDownload,
} from "@/features/session-builder/data/sessionBackupStorage";
import { parseForjaBackup } from "@/features/session-builder/domain/sessionBackup";

const dateFormatter = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" });

export function SavedSessionsPage() {
  const [drafts, setDrafts] = useState(loadSessionDrafts);
  const [pendingDeletion, setPendingDeletion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; isError?: boolean } | null>(null);

  const duplicate = (id: string) => {
    const source = drafts.find((draft) => draft.id === id);
    if (!source) return;
    setDrafts(saveSessionDraft(duplicateSessionDraft(source)));
  };

  const remove = (id: string) => {
    setDrafts(removeSessionDraft(id));
    setPendingDeletion(null);
  };

  const handleExport = () => {
    const backup = exportForjaBackup();
    triggerBackupDownload(backup);
    setFeedback({
      text: `Respaldo descargado: ${backup.drafts.length} borradores y ${backup.executions.length} ejecuciones exportados en JSON.`,
      isError: false,
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content !== "string") return;

      const parseResult = parseForjaBackup(content);
      if (!parseResult.success || !parseResult.data) {
        setFeedback({
          text: parseResult.error ?? "No se pudo procesar el archivo seleccionado.",
          isError: true,
        });
        return;
      }

      const result = importForjaBackup(parseResult.data);
      setDrafts(result.drafts);
      setFeedback({
        text: `Importación completada: ${result.importedDraftsCount} borradores y ${result.importedExecutionsCount} ejecuciones actualizados o añadidos.`,
        isError: false,
      });
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return <div className="page saved-sessions-page">
    <nav className="breadcrumbs" aria-label="Migas de pan"><Link to="/sessions">Sesiones</Link><span aria-hidden="true">/</span><span>Guardadas</span></nav>
    <PageHeader
      eyebrow="Trabajo local"
      title="Sesiones guardadas"
      description="Borradores preparados en este navegador. Puedes exportar o importar tus datos en JSON para sincronizar con otro dispositivo."
      actions={
        <div className="saved-sessions-actions">
          <button type="button" className="button button--secondary" onClick={handleExport}>
            Exportar JSON
          </button>
          <label className="button button--secondary file-input-label">
            Importar JSON
            <input
              type="file"
              accept=".json,application/json"
              className="sr-only"
              aria-label="Seleccionar archivo JSON para importar"
              onChange={handleImport}
            />
          </label>
          <Link className="button" to="/sessions/prepare">Nueva sesión <span aria-hidden="true">→</span></Link>
        </div>
      }
    />
    {feedback && (
      <div
        className={`saved-sessions-feedback ${feedback.isError ? "saved-sessions-feedback--error" : ""}`}
        role="status"
        aria-live="polite"
      >
        {feedback.text}
      </div>
    )}
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
