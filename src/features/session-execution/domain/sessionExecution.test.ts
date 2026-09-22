import { createSessionDraft } from "@/features/session-builder/domain/sessionDraft";
import { sessions } from "@/features/sessions/data/sessions";
import { createSessionExecution, validateExecutionForCompletion } from "./sessionExecution";

describe("session execution", () => {
  it("creates a stable snapshot from a prepared session", () => {
    const draft = createSessionDraft(sessions[2], new Date("2026-09-22T10:00:00.000Z"), "draft-test");
    const execution = createSessionExecution(draft, new Date("2026-09-22T11:00:00.000Z"));
    expect(execution.id).toBe("execution-draft-test");
    expect(execution.status).toBe("prepared");
    expect(execution.tasks).toHaveLength(3);
    expect(execution.tasks[0]).toMatchObject({ exerciseId: "EX-005", status: "pending", plannedPrescription: draft.tasks[0].prescription });
  });

  it("requires task outcomes, actual dose, RPE and a next decision before completion", () => {
    const execution = createSessionExecution(createSessionDraft(sessions[2]));
    expect(validateExecutionForCompletion(execution)).toHaveLength(3);
    const ready = {
      ...execution,
      sessionRpe: "6",
      nextDecision: "Conservar la estructura y revisar la carga.",
      tasks: execution.tasks.map((task) => ({ ...task, status: "completed" as const, actualDose: "2 series" })),
    };
    expect(validateExecutionForCompletion(ready)).toEqual([]);
  });

  it("requires a reason for modifications and details for triggered stop criteria", () => {
    const execution = createSessionExecution(createSessionDraft(sessions[2]));
    const changed = {
      ...execution,
      sessionRpe: "7",
      nextDecision: "Revisar la tarea.",
      tasks: execution.tasks.map((task, index) => ({ ...task, status: index === 0 ? "modified" as const : "omitted" as const, actualDose: index === 0 ? "1 serie" : "", stopCriteriaTriggered: index === 0 })),
    };
    expect(validateExecutionForCompletion(changed)).toEqual(expect.arrayContaining([
      "Explica el motivo de cada tarea modificada u omitida.",
      "Describe el criterio de parada cuando se haya activado.",
    ]));
  });
});
