export type SessionStatus = "usable" | "reviewed" | "consolidated";

export type SessionIdentity = {
  id: `SES-${string}`;
  slug: string;
  name: string;
  status: SessionStatus;
  version: string;
};

export type SessionContext = {
  audience: string[];
  requirements: string[];
  weeklyConsiderations: string[];
  resources: string[];
  organization: string[];
};

export type SessionTask = {
  exerciseId: `EX-${string}`;
  prescription: string;
  quality: string;
  adaptations: string[];
  stopCriteria: string[];
};

export type SessionBlock = {
  id: string;
  name: string;
  purpose: string;
  tasks: SessionTask[];
};

export type SessionAdaptation = {
  level: "minor" | "task" | "objective";
  label: string;
  items: string[];
};

export type Session = {
  identity: SessionIdentity;
  purpose: string;
  primaryPriority: string;
  secondaryObjectives: string[];
  notPrioritized: string[];
  context: SessionContext;
  readinessChecks: string[];
  blocks: SessionBlock[];
  adaptations: SessionAdaptation[];
  recordAfter: string[];
  traceability: {
    sourcePath: string;
    decisions: string[];
  };
  usageNote: string;
};
