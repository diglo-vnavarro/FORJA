import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ForjaIcon } from "@/design-system/forja/src/icons";
import { exercises, getExerciseById } from "@/features/exercises/data/exercises";
import { loadSessionDraft, removeSessionDraft, saveSessionDraft } from "@/features/session-builder/data/sessionDraftStorage";
import { createSessionDraft, type SessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { sessions } from "@/features/sessions/data/sessions";

const findTemplate = (templateId: string) => sessions.find((session) => session.identity.id === templateId) ?? sessions[0];

function isCompatibleDraft(draft: SessionDraft) {
  const template = sessions.find((session) => session.identity.id === draft.templateId);
  if (!template) return false;
  const expectedKeys = new Set(createSessionDraft(template).tasks.map((task) => task.key));
  return draft.tasks.length === expectedKeys.size
    && draft.tasks.every((task) => expectedKeys.has(task.key) && Boolean(getExerciseById(task.exerciseId)));
}

export function SessionBuilderPage() {
  const [draft, setDraft] = useState<SessionDraft>(() => {
    const stored = loadSessionDraft();
    return stored && isCompatibleDraft(stored) ? stored : createSessionDraft(sessions[0]);
  });
  const [saveMessage, setSaveMessage] = useState("");
  const template = findTemplate(draft.templateId);
  const tasksByKey = useMemo(() => new Map(draft.tasks.map((task) => [task.key, task])), [draft.tasks]);
  const reviewedCount = draft.tasks.filter((task) => task.criteriaReviewed).length;

  const updateDraft = (changes: Partial<SessionDraft>) => {
    setSaveMessage("");
    setDraft((current) => ({ ...current, ...changes, updatedAt: new Date().toISOString() }));
  };

  const updateTask = (key: string, changes: Partial<SessionDraft["tasks"][number]>) => {
    setSaveMessage("");
    setDraft((current) => ({
      ...current,
      tasks: current.tasks.map((task) => task.key === key ? { ...task, ...changes } : task),
      updatedAt: new Date().toISOString(),
    }));
  };

  const selectTemplate = (templateId: string) => {
    const nextTemplate = findTemplate(templateId);
    setDraft(createSessionDraft(nextTemplate));
    setSaveMessage("Plantilla cargada. Guarda el borrador para conservar este cambio.");
  };

  const save = () => {
    const saved = { ...draft, updatedAt: new Date().toISOString() };
    saveSessionDraft(saved);
    setDraft(saved);
    setSaveMessage("Borrador guardado en este navegador.");
  };

  const reset = () => {
    removeSessionDraft();
    setDraft(createSessionDraft(template));
    setSaveMessage("Se ha restaurado la plantilla original.");
  };

  return <div className="page session-builder-page">
    <nav className="breadcrumbs" aria-label="Migas de pan"><Link to="/sessions">Sesiones</Link><span aria-hidden="true">/</span><span>Preparar sesión</span></nav>
    <header className="builder-header">
      <div><p className="eyebrow">Constructor manual MVP</p><h1>Preparar una sesión</h1><p className="page-lead">Adapta una sesión revisada a un contexto concreto sin perder su fuente, sus criterios de calidad ni sus límites.</p></div>
      <div className="builder-header__actions"><button className="button button--secondary" type="button" onClick={reset}>Restaurar</button><button className="button" type="button" onClick={save}>Guardar borrador</button></div>
    </header>

    <p className="builder-boundary"><ForjaIcon name="observe" size={20} />Esta herramienta organiza decisiones del entrenador. No evalúa al deportista ni determina automáticamente qué sesión es apropiada.</p>
    {saveMessage && <p className="builder-message" role="status">{saveMessage}</p>}

    <div className="builder-layout">
      <main className="builder-editor">
        <section className="builder-panel">
          <div className="builder-panel__heading"><span>01</span><div><h2>Punto de partida</h2><p>Selecciona una sesión base ya revisada.</p></div></div>
          <label className="builder-field"><span>Plantilla FORJA</span><select value={draft.templateId} onChange={(event) => selectTemplate(event.target.value)}>{sessions.map((session) => <option key={session.identity.id} value={session.identity.id}>{session.identity.id} — {session.identity.name}</option>)}</select></label>
          <div className="builder-source"><strong>{template.primaryPriority}</strong><span>Fuente: {template.identity.id} · {template.traceability.sourcePath}</span></div>
        </section>

        <section className="builder-panel">
          <div className="builder-panel__heading"><span>02</span><div><h2>Contexto del grupo</h2><p>Registra solo información necesaria para preparar esta sesión.</p></div></div>
          <div className="builder-form-grid">
            <label className="builder-field builder-field--wide"><span>Título de trabajo</span><input value={draft.title} onChange={(event) => updateDraft({ title: event.target.value })} /></label>
            <label className="builder-field"><span>Fecha prevista</span><input type="date" value={draft.scheduledDate} onChange={(event) => updateDraft({ scheduledDate: event.target.value })} /></label>
            <label className="builder-field"><span>Contexto del grupo</span><input value={draft.groupContext} onChange={(event) => updateDraft({ groupContext: event.target.value })} placeholder="Ej.: grupo sub-16, 12 participantes" /></label>
            <label className="builder-field builder-field--wide"><span>Comprobación inicial y relación con la semana</span><textarea rows={3} value={draft.readinessNote} onChange={(event) => updateDraft({ readinessNote: event.target.value })} placeholder="Registra disponibilidad, actividad reciente, molestias comunicadas y cualquier ajuste de contexto." /></label>
          </div>
        </section>

        <section className="builder-panel">
          <div className="builder-panel__heading"><span>03</span><div><h2>Tareas y dosis</h2><p>Sustituye ejercicios solo de forma consciente y conserva visibles los criterios de la sesión base.</p></div></div>
          <div className="builder-task-list">{template.blocks.flatMap((block) => block.tasks.map((sourceTask, taskIndex) => {
            const key = `${block.id}-${taskIndex}`;
            const task = tasksByKey.get(key);
            if (!task) return null;
            return <article className="builder-task" key={key}>
              <header><div><span>{block.name}</span><h3>{getExerciseById(task.exerciseId)?.identity.displayName ?? task.exerciseId}</h3></div><small>{task.exerciseId === sourceTask.exerciseId ? `Origen: ${sourceTask.exerciseId}` : `Sustituye a ${sourceTask.exerciseId}`}</small></header>
              <div className="builder-form-grid">
                <label className="builder-field"><span>Ejercicio</span><select value={task.exerciseId} onChange={(event) => updateTask(key, { exerciseId: event.target.value })}>{exercises.map((exercise) => <option key={exercise.identity.id} value={exercise.identity.id}>{exercise.identity.id} — {exercise.identity.displayName}</option>)}</select></label>
                <label className="builder-field builder-field--wide"><span>Dosis prevista</span><textarea rows={3} value={task.prescription} onChange={(event) => updateTask(key, { prescription: event.target.value })} /></label>
                <label className="builder-field builder-field--wide"><span>Ajuste previsto, si procede</span><input value={task.adaptationNote} onChange={(event) => updateTask(key, { adaptationNote: event.target.value })} placeholder="Ej.: reducir rango o usar el extremo inferior de repeticiones" /></label>
              </div>
              <div className="builder-criteria"><div><strong>Calidad de la tarea original</strong><p>{sourceTask.quality}</p></div><div><strong>Parar o modificar</strong><ul>{sourceTask.stopCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></div></div>
              {task.exerciseId !== sourceTask.exerciseId && <p className="builder-substitution-note"><ForjaIcon name="modifyTask" size={17} />La sustitución requiere revisar también la <Link to={`/exercises/${task.exerciseId}`}>ficha de {task.exerciseId}</Link>; los criterios mostrados pertenecen a la tarea original.</p>}
              <label className="builder-check"><input type="checkbox" checked={task.criteriaReviewed} onChange={(event) => updateTask(key, { criteriaReviewed: event.target.checked })} /><span>He revisado la ficha seleccionada y los criterios de calidad y parada aplicables.</span></label>
            </article>;
          }))}</div>
        </section>
      </main>

      <aside className="builder-preview" aria-label="Ficha final de la sesión">
        <div className="builder-preview__toolbar"><span>Ficha final</span><button type="button" onClick={() => window.print()}>Imprimir</button></div>
        <div className="builder-sheet">
          <header><p>{template.identity.id} · Borrador local</p><h2>{draft.title || template.identity.name}</h2><span>{draft.scheduledDate || "Fecha pendiente"}{draft.groupContext ? ` · ${draft.groupContext}` : ""}</span></header>
          <section><strong>Prioridad</strong><p>{template.primaryPriority}</p></section>
          {draft.readinessNote && <section><strong>Contexto registrado</strong><p>{draft.readinessNote}</p></section>}
          <section><strong>Tareas</strong><ol>{template.blocks.flatMap((block) => block.tasks.map((sourceTask, taskIndex) => { const task = tasksByKey.get(`${block.id}-${taskIndex}`); if (!task) return null; const exercise = getExerciseById(task.exerciseId); return <li key={task.key}><div><b>{exercise?.identity.displayName ?? task.exerciseId}</b><small>{block.name} · {task.exerciseId}</small></div><p>{task.prescription}</p>{task.adaptationNote && <em>Ajuste: {task.adaptationNote}</em>}</li>; }))}</ol></section>
          <footer><span>{reviewedCount}/{draft.tasks.length} tareas con criterios revisados</span><p>{template.usageNote}</p><small>Basada en {template.identity.id}. Los cambios del borrador no modifican la sesión canónica.</small></footer>
        </div>
      </aside>
    </div>
  </div>;
}
