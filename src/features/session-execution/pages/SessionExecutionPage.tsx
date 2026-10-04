import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { ForjaIcon } from "@/design-system/forja/src/icons";
import { getExerciseById } from "@/features/exercises/data/exercises";
import { loadExecutionByDraftId, saveSessionExecution } from "@/features/session-execution/data/sessionExecutionStorage";
import { createSessionExecution, validateExecutionForCompletion, type SessionExecution } from "@/features/session-execution/domain/sessionExecution";
import { loadSessionDraftById } from "@/features/session-builder/data/sessionDraftStorage";

const resultOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "completed", label: "Completada según lo previsto" },
  { value: "modified", label: "Modificada" },
  { value: "omitted", label: "Omitida" },
];

export function SessionExecutionPage() {
  const { draftId = "" } = useParams();
  const draft = useMemo(() => loadSessionDraftById(draftId), [draftId]);
  const [execution, setExecution] = useState<SessionExecution | null>(() => {
    if (!draft) return null;
    return loadExecutionByDraftId(draft.id) ?? createSessionExecution(draft);
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [fieldMode, setFieldMode] = useState<boolean>(true);
  const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);

  if (!draft || !execution) {
    return (
      <div className="page">
        <EmptyState
          title="Sesión preparada no encontrada"
          description="Guarda primero una sesión preparada para poder registrar su ejecución."
        />
        <Link className="button" to="/sessions/saved">
          Volver a sesiones guardadas
        </Link>
      </div>
    );
  }

  const updateExecution = (changes: Partial<SessionExecution>) => {
    setMessage("");
    setErrors([]);
    setExecution((current) =>
      current
        ? { ...current, ...changes, updatedAt: new Date().toISOString() }
        : current,
    );
  };

  const updateTask = (
    key: string,
    changes: Partial<SessionExecution["tasks"][number]>,
  ) => {
    setMessage("");
    setErrors([]);
    setExecution((current) =>
      current
        ? {
            ...current,
            tasks: current.tasks.map((task) =>
              task.key === key ? { ...task, ...changes } : task,
            ),
            updatedAt: new Date().toISOString(),
          }
        : current,
    );
  };

  const quickCompleteTask = (key: string, plannedPrescription: string, index: number) => {
    setMessage("");
    setErrors([]);
    setExecution((current) => {
      if (!current) return current;
      const updatedTasks = current.tasks.map((task) =>
        task.key === key
          ? {
              ...task,
              status: "completed" as const,
              actualDose: task.actualDose.trim() ? task.actualDose : plannedPrescription || "Completada según lo previsto",
            }
          : task,
      );
      return {
        ...current,
        tasks: updatedTasks,
        updatedAt: new Date().toISOString(),
      };
    });

    if (index < execution.tasks.length - 1) {
      setActiveTaskIndex(index + 1);
    }
  };

  const saveProgress = () => {
    const saved = { ...execution, updatedAt: new Date().toISOString() };
    saveSessionExecution(saved);
    setExecution(saved);
    setMessage("Registro guardado en este navegador.");
  };

  const complete = () => {
    const validationErrors = validateExecutionForCompletion(execution);
    if (validationErrors.length) {
      setErrors(validationErrors);
      setMessage("");
      return;
    }
    const timestamp = new Date().toISOString();
    const completed: SessionExecution = {
      ...execution,
      status: "completed",
      completedAt: timestamp,
      updatedAt: timestamp,
    };
    saveSessionExecution(completed);
    setExecution(completed);
    setMessage("Sesión marcada como completada. El registro queda en modo de solo lectura.");
  };

  const completedTasks = execution.tasks.filter(
    (task) => task.status === "completed" || task.status === "modified",
  ).length;

  if (execution.status === "completed") {
    return (
      <article className="page execution-page execution-page--completed">
        <nav className="breadcrumbs" aria-label="Migas de pan">
          <Link to="/sessions">Sesiones</Link>
          <span aria-hidden="true">/</span>
          <Link to="/sessions/saved">Guardadas</Link>
          <span aria-hidden="true">/</span>
          <span>Registro completado</span>
        </nav>
        <header className="execution-complete-hero">
          <ForjaIcon name="competence" size={34} />
          <div>
            <p className="eyebrow">Registro completado</p>
            <h1>{execution.title}</h1>
            <p>
              {completedTasks}/{execution.tasks.length} tareas realizadas o modificadas · RPE {execution.sessionRpe}/10
            </p>
          </div>
        </header>
        {message && (
          <p className="builder-message" role="status">
            {message}
          </p>
        )}
        <section className="execution-summary-grid">
          {execution.tasks.map((task) => (
            <article key={task.key}>
              <header>
                <span>{task.exerciseId}</span>
                <strong>
                  {resultOptions.find((option) => option.value === task.status)?.label}
                </strong>
              </header>
              <h2>{getExerciseById(task.exerciseId)?.identity.displayName ?? task.exerciseId}</h2>
              <dl>
                <div>
                  <dt>Planificado</dt>
                  <dd>{task.plannedPrescription}</dd>
                </div>
                <div>
                  <dt>Realizado</dt>
                  <dd>{task.actualDose || "No realizada"}</dd>
                </div>
                {task.modificationReason && (
                  <div>
                    <dt>Motivo</dt>
                    <dd>{task.modificationReason}</dd>
                  </div>
                )}
                {task.stopCriteriaTriggered && (
                  <div>
                    <dt>Criterio de parada</dt>
                    <dd>{task.stopNote}</dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </section>
        <section className="execution-final-notes">
          <div>
            <span>Observaciones</span>
            <p>{execution.observations || "Sin observaciones adicionales."}</p>
          </div>
          <div>
            <span>Próxima decisión</span>
            <p>{execution.nextDecision}</p>
          </div>
        </section>
        <p className="execution-lock-note">
          <ForjaIcon name="observe" size={19} />
          Este registro es una instantánea de lo realizado y no cambia aunque se edite el borrador original.
        </p>
      </article>
    );
  }

  const activeTask = execution.tasks[activeTaskIndex] ?? execution.tasks[0];
  const isLastTask = activeTaskIndex === execution.tasks.length - 1;

  return (
    <div className={`page execution-page ${fieldMode ? "execution-page--field" : ""}`}>
      <nav className="breadcrumbs" aria-label="Migas de pan">
        <Link to="/sessions">Sesiones</Link>
        <span aria-hidden="true">/</span>
        <Link to="/sessions/saved">Guardadas</Link>
        <span aria-hidden="true">/</span>
        <span>Registrar ejecución</span>
      </nav>

      <header className="builder-header">
        <div>
          <p className="eyebrow">
            {fieldMode ? "Modo campo (sol y pista)" : "Registro de ejecución"}
          </p>
          <h1>{execution.title}</h1>
          <p className="page-lead">
            Compara lo planificado con lo realizado y registra únicamente información útil para decisiones posteriores.
          </p>
        </div>
        <div className="builder-header__actions">
          <button
            className={`button ${fieldMode ? "button--primary" : "button--secondary"}`}
            type="button"
            onClick={() => setFieldMode((m) => !m)}
          >
            {fieldMode ? "Cambiar a modo lista" : "Cambiar a modo campo"}
          </button>
          <button className="button button--secondary" type="button" onClick={saveProgress}>
            Guardar progreso
          </button>
          <button className="button" type="button" onClick={complete}>
            Completar sesión
          </button>
        </div>
      </header>

      <p className="builder-boundary">
        <ForjaIcon name="observe" size={20} />
        El registro describe lo ocurrido. No diagnostica molestias ni sustituye una valoración sanitaria.
      </p>

      {message && (
        <p className="builder-message" role="status">
          {message}
        </p>
      )}

      {errors.length > 0 && (
        <section className="execution-errors" role="alert">
          <strong>Falta información para completar la sesión:</strong>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="execution-context">
        <div>
          <span>Plantilla</span>
          <strong>{execution.templateId}</strong>
        </div>
        <div>
          <span>Fecha prevista</span>
          <strong>{execution.scheduledDate || "No indicada"}</strong>
        </div>
        <div>
          <span>Contexto</span>
          <strong>{execution.groupContext || "No indicado"}</strong>
        </div>
        <div>
          <span>Progreso</span>
          <strong>
            {completedTasks}/{execution.tasks.length} completadas
          </strong>
        </div>
      </section>

      {/* Controles de navegación en modo campo */}
      {fieldMode && (
        <nav className="field-stepper" aria-label="Navegación de tareas en modo campo">
          <div className="field-stepper__status">
            <span className="field-stepper__label">
              Tarea {activeTaskIndex + 1} de {execution.tasks.length}:{" "}
              <strong>
                {getExerciseById(activeTask.exerciseId)?.identity.displayName ?? activeTask.exerciseId}
              </strong>
            </span>
            <div className="field-stepper__actions">
              <button
                type="button"
                className="field-stepper__btn"
                disabled={activeTaskIndex === 0}
                onClick={() => setActiveTaskIndex((idx) => Math.max(0, idx - 1))}
                aria-label="Tarea anterior"
              >
                Anterior
              </button>
              <button
                type="button"
                className="field-stepper__btn field-stepper__btn--primary"
                disabled={isLastTask}
                onClick={() => setActiveTaskIndex((idx) => Math.min(execution.tasks.length - 1, idx + 1))}
                aria-label="Siguiente tarea"
              >
                Siguiente
              </button>
            </div>
          </div>
          <div className="field-stepper__progress">
            <div
              className="field-stepper__bar"
              style={{ width: `${((activeTaskIndex + 1) / execution.tasks.length) * 100}%` }}
            />
          </div>
        </nav>
      )}

      <section className="execution-task-list" aria-label="Registro por tareas">
        {execution.tasks.map((task, index) => {
          const exercise = getExerciseById(task.exerciseId);
          const isActive = !fieldMode || index === activeTaskIndex;
          return (
            <article
              className={`execution-task ${isActive ? "execution-task--active" : "execution-task--hidden"}`}
              key={task.key}
            >
              <header>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>{task.exerciseId}</small>
                  <h2>{exercise?.identity.displayName ?? task.exerciseId}</h2>
                </div>
              </header>

              <div className="execution-plan">
                <strong>Dosis planificada</strong>
                <p>{task.plannedPrescription}</p>
                {task.plannedAdaptation && <em>Ajuste previsto: {task.plannedAdaptation}</em>}
              </div>

              {/* Botón rápido para un toque en modo campo */}
              <div className="field-quick-action">
                <button
                  type="button"
                  className="button button--quick-complete"
                  onClick={() => quickCompleteTask(task.key, task.plannedPrescription, index)}
                  aria-label={`Registrar ${exercise?.identity.displayName ?? task.exerciseId} como hecha en un toque`}
                >
                  ✓ Hecha según lo previsto
                </button>
              </div>

              <div className="builder-form-grid">
                <label className="builder-field">
                  <span>Resultado de {exercise?.identity.displayName ?? task.exerciseId}</span>
                  <select
                    value={task.status}
                    onChange={(event) =>
                      updateTask(task.key, {
                        status: event.target.value as SessionExecution["tasks"][number]["status"],
                      })
                    }
                  >
                    {resultOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="builder-field">
                  <span>Dosis realizada</span>
                  <input
                    value={task.actualDose}
                    disabled={task.status === "omitted"}
                    onChange={(event) => updateTask(task.key, { actualDose: event.target.value })}
                    placeholder="Series, repeticiones, carga, tiempo o distancia"
                  />
                </label>

                {(task.status === "modified" || task.status === "omitted") && (
                  <label className="builder-field builder-field--wide">
                    <span>Motivo de la modificación u omisión</span>
                    <input
                      value={task.modificationReason}
                      onChange={(event) =>
                        updateTask(task.key, { modificationReason: event.target.value })
                      }
                    />
                  </label>
                )}

                <label className="execution-stop-check">
                  <input
                    type="checkbox"
                    checked={task.stopCriteriaTriggered}
                    onChange={(event) =>
                      updateTask(task.key, {
                        stopCriteriaTriggered: event.target.checked,
                        stopNote: event.target.checked ? task.stopNote : "",
                      })
                    }
                  />
                  <span>Se activó un criterio de parada</span>
                </label>

                {task.stopCriteriaTriggered && (
                  <label className="builder-field builder-field--wide">
                    <span>Criterio observado y decisión tomada</span>
                    <input
                      value={task.stopNote}
                      onChange={(event) => updateTask(task.key, { stopNote: event.target.value })}
                    />
                  </label>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className="execution-close-panel">
        <div className="builder-panel__heading">
          <span>✓</span>
          <div>
            <h2>Cierre de la sesión</h2>
            <p>
              Registra la respuesta global y la siguiente decisión, no una explicación retrospectiva exhaustiva.
            </p>
          </div>
        </div>
        <div className="builder-form-grid">
          <label className="builder-field">
            <span>RPE global de la sesión</span>
            <select
              value={execution.sessionRpe}
              onChange={(event) => updateExecution({ sessionRpe: event.target.value })}
            >
              <option value="">Seleccionar</option>
              {Array.from({ length: 11 }, (_, value) => (
                <option key={value} value={String(value)}>
                  {value}/10
                </option>
              ))}
            </select>
          </label>
          <label className="builder-field builder-field--wide">
            <span>Observaciones relevantes</span>
            <textarea
              rows={3}
              value={execution.observations}
              onChange={(event) => updateExecution({ observations: event.target.value })}
            />
          </label>
          <label className="builder-field builder-field--wide">
            <span>Próxima decisión del entrenador</span>
            <textarea
              rows={3}
              value={execution.nextDecision}
              onChange={(event) => updateExecution({ nextDecision: event.target.value })}
              placeholder="Qué conviene conservar, revisar o adaptar en la próxima sesión"
            />
          </label>
        </div>
      </section>
    </div>
  );
}
