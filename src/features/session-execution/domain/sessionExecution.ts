import type { SessionDraft } from "@/features/session-builder/domain/sessionDraft";

export const SESSION_EXECUTION_SCHEMA_VERSION = 1 as const;

export type ExecutionTaskStatus = "pending" | "completed" | "modified" | "omitted";

export type SessionExecutionTask = {
  key: string;
  exerciseId: string;
  plannedPrescription: string;
  plannedAdaptation: string;
  status: ExecutionTaskStatus;
  actualDose: string;
  modificationReason: string;
  stopCriteriaTriggered: boolean;
  stopNote: string;
};

export type SessionExecution = {
  schemaVersion: typeof SESSION_EXECUTION_SCHEMA_VERSION;
  id: string;
  sourceDraftId: string;
  templateId: string;
  title: string;
  scheduledDate: string;
  groupContext: string;
  status: "prepared" | "completed";
  tasks: SessionExecutionTask[];
  sessionRpe: string;
  observations: string;
  nextDecision: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string;
};

export function createSessionExecution(draft: SessionDraft, now = new Date()): SessionExecution {
  const timestamp = now.toISOString();
  return {
    schemaVersion: SESSION_EXECUTION_SCHEMA_VERSION,
    id: `execution-${draft.id}`,
    sourceDraftId: draft.id,
    templateId: draft.templateId,
    title: draft.title,
    scheduledDate: draft.scheduledDate,
    groupContext: draft.groupContext,
    status: "prepared",
    tasks: draft.tasks.map((task) => ({
      key: task.key,
      exerciseId: task.exerciseId,
      plannedPrescription: task.prescription,
      plannedAdaptation: task.adaptationNote,
      status: "pending",
      actualDose: "",
      modificationReason: "",
      stopCriteriaTriggered: false,
      stopNote: "",
    })),
    sessionRpe: "",
    observations: "",
    nextDecision: "",
    createdAt: timestamp,
    updatedAt: timestamp,
    completedAt: "",
  };
}

export function validateExecutionForCompletion(execution: SessionExecution) {
  const errors: string[] = [];
  if (execution.tasks.some((task) => task.status === "pending")) errors.push("Indica el resultado de todas las tareas.");
  if (execution.tasks.some((task) => (task.status === "completed" || task.status === "modified") && !task.actualDose.trim())) errors.push("Registra la dosis realizada en cada tarea completada o modificada.");
  if (execution.tasks.some((task) => (task.status === "modified" || task.status === "omitted") && !task.modificationReason.trim())) errors.push("Explica el motivo de cada tarea modificada u omitida.");
  if (execution.tasks.some((task) => task.stopCriteriaTriggered && !task.stopNote.trim())) errors.push("Describe el criterio de parada cuando se haya activado.");
  if (!execution.sessionRpe) errors.push("Registra el RPE global de la sesión.");
  if (!execution.nextDecision.trim()) errors.push("Registra la próxima decisión del entrenador.");
  return errors;
}

export function isSessionExecution(value: unknown): value is SessionExecution {
  if (!value || typeof value !== "object") return false;
  const execution = value as Partial<SessionExecution>;
  return execution.schemaVersion === SESSION_EXECUTION_SCHEMA_VERSION
    && typeof execution.id === "string" && execution.id.length > 0
    && typeof execution.sourceDraftId === "string"
    && typeof execution.templateId === "string"
    && typeof execution.title === "string"
    && typeof execution.scheduledDate === "string"
    && typeof execution.groupContext === "string"
    && (execution.status === "prepared" || execution.status === "completed")
    && typeof execution.sessionRpe === "string"
    && typeof execution.observations === "string"
    && typeof execution.nextDecision === "string"
    && typeof execution.createdAt === "string" && Number.isFinite(Date.parse(execution.createdAt))
    && typeof execution.updatedAt === "string" && Number.isFinite(Date.parse(execution.updatedAt))
    && typeof execution.completedAt === "string"
    && Array.isArray(execution.tasks)
    && execution.tasks.every((task) => task
      && typeof task.key === "string"
      && typeof task.exerciseId === "string"
      && typeof task.plannedPrescription === "string"
      && typeof task.plannedAdaptation === "string"
      && ["pending", "completed", "modified", "omitted"].includes(task.status)
      && typeof task.actualDose === "string"
      && typeof task.modificationReason === "string"
      && typeof task.stopCriteriaTriggered === "boolean"
      && typeof task.stopNote === "string");
}
