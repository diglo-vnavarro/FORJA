import { createSessionExecution } from "@/features/session-execution/domain/sessionExecution";
import { createSessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { sessions } from "@/features/sessions/data/sessions";
import { loadExecutionByDraftId, loadSessionExecutions, saveSessionExecution, SESSION_EXECUTIONS_STORAGE_KEY } from "./sessionExecutionStorage";

const createStorage = () => {
  const values = new Map<string, string>();
  return { values, storage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } } };
};

it("stores one execution snapshot per prepared draft", () => {
  const { values, storage } = createStorage();
  const execution = createSessionExecution(createSessionDraft(sessions[0], new Date(), "draft-1"));
  saveSessionExecution(execution, storage);
  expect(values.has(SESSION_EXECUTIONS_STORAGE_KEY)).toBe(true);
  expect(loadExecutionByDraftId("draft-1", storage)).toEqual(execution);
  expect(loadSessionExecutions(storage)).toHaveLength(1);
});

it("updates an existing execution instead of duplicating it", () => {
  const { storage } = createStorage();
  const execution = createSessionExecution(createSessionDraft(sessions[0], new Date(), "draft-1"));
  saveSessionExecution(execution, storage);
  saveSessionExecution({ ...execution, observations: "Registro actualizado", updatedAt: new Date(Date.now() + 1000).toISOString() }, storage);
  expect(loadSessionExecutions(storage)).toHaveLength(1);
  expect(loadExecutionByDraftId("draft-1", storage)?.observations).toBe("Registro actualizado");
});
