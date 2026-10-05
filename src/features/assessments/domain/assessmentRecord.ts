import type { CompetenceState } from "./assessment";

export type TaskEvaluationCompetence = CompetenceState | "not_measured";

export type TaskEvaluationResult = {
  taskId: string;
  competence: TaskEvaluationCompetence;
  notes?: string;
  selectedExerciseId?: `EX-${string}`;
};

export type AssessmentRecord = {
  id: string;
  athleteId: string;
  assessmentId: `EVAL-${string}`;
  date: string;
  evaluator?: string;
  taskResults: Record<string, TaskEvaluationResult>;
  overallNotes?: string;
  recommendedExerciseIds: `EX-${string}`[];
};

export type TaskProgressStatus = "improved" | "maintained" | "regressed" | "new" | "unmeasured";

export type TaskProgress = {
  taskId: string;
  previousCompetence: TaskEvaluationCompetence;
  currentCompetence: TaskEvaluationCompetence;
  status: TaskProgressStatus;
};

export type AssessmentProgress = {
  previousDate: string;
  currentDate: string;
  tasks: TaskProgress[];
  summary: {
    improved: number;
    maintained: number;
    regressed: number;
    unmeasured: number;
    total: number;
  };
};

export function isAssessmentRecord(value: unknown): value is AssessmentRecord {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.athleteId === "string" &&
    typeof candidate.assessmentId === "string" &&
    candidate.assessmentId.startsWith("EVAL-") &&
    typeof candidate.date === "string" &&
    typeof candidate.taskResults === "object" &&
    candidate.taskResults !== null &&
    Array.isArray(candidate.recommendedExerciseIds)
  );
}

const COMPETENCE_WEIGHT: Record<TaskEvaluationCompetence, number> = {
  insufficient: 1,
  partial: 2,
  sufficient: 3,
  not_measured: 0,
};

export function compareAssessmentRecords(
  previous: AssessmentRecord,
  current: AssessmentRecord
): AssessmentProgress {
  const taskIds = Array.from(
    new Set([...Object.keys(previous.taskResults), ...Object.keys(current.taskResults)])
  );

  let improved = 0;
  let maintained = 0;
  let regressed = 0;
  let unmeasured = 0;

  const tasks: TaskProgress[] = taskIds.map((taskId) => {
    const prev = previous.taskResults[taskId]?.competence ?? "not_measured";
    const curr = current.taskResults[taskId]?.competence ?? "not_measured";

    if (prev === "not_measured" || curr === "not_measured") {
      unmeasured++;
      return { taskId, previousCompetence: prev, currentCompetence: curr, status: "unmeasured" };
    }

    const prevWeight = COMPETENCE_WEIGHT[prev];
    const currWeight = COMPETENCE_WEIGHT[curr];

    if (currWeight > prevWeight) {
      improved++;
      return { taskId, previousCompetence: prev, currentCompetence: curr, status: "improved" };
    }
    if (currWeight < prevWeight) {
      regressed++;
      return { taskId, previousCompetence: prev, currentCompetence: curr, status: "regressed" };
    }
    maintained++;
    return { taskId, previousCompetence: prev, currentCompetence: curr, status: "maintained" };
  });

  return {
    previousDate: previous.date,
    currentDate: current.date,
    tasks,
    summary: {
      improved,
      maintained,
      regressed,
      unmeasured,
      total: taskIds.length,
    },
  };
}
