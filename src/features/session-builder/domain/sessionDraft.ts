import type { Session } from "@/features/sessions/domain/session";

export const SESSION_DRAFT_SCHEMA_VERSION = 2 as const;

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
  id: string;
  templateId: string;
  title: string;
  scheduledDate: string;
  groupContext: string;
  readinessNote: string;
  tasks: SessionDraftTask[];
  createdAt: string;
  updatedAt: string;
};

export function createDraftId(now = new Date()) {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `draft-${now.getTime().toString(36)}-${suffix}`;
}

export function createSessionDraft(session: Session, now = new Date(), id = createDraftId(now)): SessionDraft {
  const timestamp = now.toISOString();
  return {
    schemaVersion: SESSION_DRAFT_SCHEMA_VERSION,
    id,
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
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function duplicateSessionDraft(draft: SessionDraft, now = new Date(), id = createDraftId(now)): SessionDraft {
  const timestamp = now.toISOString();
  return {
    ...draft,
    id,
    title: `${draft.title} (copia)`,
    scheduledDate: "",
    tasks: draft.tasks.map((task) => ({ ...task, criteriaReviewed: false })),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function isSessionDraft(value: unknown): value is SessionDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<SessionDraft>;
  return draft.schemaVersion === SESSION_DRAFT_SCHEMA_VERSION
    && typeof draft.id === "string" && draft.id.length > 0
    && typeof draft.templateId === "string"
    && typeof draft.title === "string"
    && typeof draft.scheduledDate === "string"
    && typeof draft.groupContext === "string"
    && typeof draft.readinessNote === "string"
    && typeof draft.createdAt === "string" && Number.isFinite(Date.parse(draft.createdAt))
    && typeof draft.updatedAt === "string" && Number.isFinite(Date.parse(draft.updatedAt))
    && Array.isArray(draft.tasks)
    && draft.tasks.every((task) => task
      && typeof task.key === "string"
      && typeof task.sourceExerciseId === "string"
      && typeof task.exerciseId === "string"
      && typeof task.prescription === "string"
      && typeof task.adaptationNote === "string"
      && typeof task.criteriaReviewed === "boolean");
}
