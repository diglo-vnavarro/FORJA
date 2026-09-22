import type { Session } from "@/features/sessions/domain/session";

export const SESSION_DRAFT_SCHEMA_VERSION = 1 as const;

export type SessionDraftTask = {
  key: string;
  sourceExerciseId: string;
  exerciseId: string;
  prescription: string;
  adaptationNote: string;
  criteriaReviewed: boolean;
};

export type SessionDraft = {
  schemaVersion: typeof SESSION_DRAFT_SCHEMA_VERSION;
  templateId: string;
  title: string;
  scheduledDate: string;
  groupContext: string;
  readinessNote: string;
  tasks: SessionDraftTask[];
  updatedAt: string;
};

export function createSessionDraft(session: Session, now = new Date()): SessionDraft {
  return {
    schemaVersion: SESSION_DRAFT_SCHEMA_VERSION,
    templateId: session.identity.id,
    title: session.identity.name,
    scheduledDate: "",
    groupContext: "",
    readinessNote: "",
    tasks: session.blocks.flatMap((block) => block.tasks.map((task, index) => ({
      key: `${block.id}-${index}`,
      sourceExerciseId: task.exerciseId,
      exerciseId: task.exerciseId,
      prescription: task.prescription,
      adaptationNote: "",
      criteriaReviewed: false,
    }))),
    updatedAt: now.toISOString(),
  };
}

export function isSessionDraft(value: unknown): value is SessionDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<SessionDraft>;
  return draft.schemaVersion === SESSION_DRAFT_SCHEMA_VERSION
    && typeof draft.templateId === "string"
    && typeof draft.title === "string"
    && typeof draft.scheduledDate === "string"
    && typeof draft.groupContext === "string"
    && typeof draft.readinessNote === "string"
    && typeof draft.updatedAt === "string"
    && Array.isArray(draft.tasks)
    && draft.tasks.every((task) => task
      && typeof task.key === "string"
      && typeof task.sourceExerciseId === "string"
      && typeof task.exerciseId === "string"
      && typeof task.prescription === "string"
      && typeof task.adaptationNote === "string"
      && typeof task.criteriaReviewed === "boolean");
}
