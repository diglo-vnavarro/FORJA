export type AssessmentStatus = "draft" | "review" | "usable" | "consolidated";

export type CompetenceState = "sufficient" | "partial" | "insufficient";

export type AssessmentIdentity = {
  id: `EVAL-${string}`;
  slug: string;
  name: string;
  status: AssessmentStatus;
  version: string;
};

export type AssessmentRequirement = {
  space: string;
  equipment: string;
  estimatedDuration: string;
  warmup: string;
};

export type AssessmentTaskCriteria = {
  sufficient: string;
  partial: string;
  insufficient: string;
};

export type AssessmentDecisionBranch = {
  exerciseIds: `EX-${string}`[];
  description: string;
};

export type AssessmentTaskDecision = {
  sufficient: AssessmentDecisionBranch;
  partialOrInsufficient?: AssessmentDecisionBranch;
  partial?: AssessmentDecisionBranch;
  insufficient?: AssessmentDecisionBranch;
};

export type AssessmentTask = {
  id: string;
  title: string;
  objective: string;
  cue: string;
  whatToObserve: string;
  criteria: AssessmentTaskCriteria;
  decision: AssessmentTaskDecision;
};

export type Assessment = {
  identity: AssessmentIdentity;
  purpose: string;
  operationalQuestion: string;
  references: string[];
  requirements: AssessmentRequirement;
  safetyAndStopCriteria: string[];
  tasks: AssessmentTask[];
  decisionSummary: string[];
  traceability: {
    sourcePath: string;
  };
};
