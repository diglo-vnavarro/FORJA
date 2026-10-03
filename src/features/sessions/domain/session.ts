export type SessionStatus = "draft" | "usable" | "reviewed" | "consolidated";

export type SessionIdentity = {
  id: `SES-${string}`;
  slug: string;
  name: string;
  status: SessionStatus;
  version: string;
};

// Cada lista conserva el orden del documento: párrafos y elementos de lista.
export type SessionContext = {
  profile: string[];
  weekly: string[];
  resources: string[];
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
  notes: string[];
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
  purposeNotes: string[];
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
