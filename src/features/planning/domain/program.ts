export type ProgramDay = {
  dayName: string;
  matchDayOffset: string;
  clubActivity: string;
  forjaStimulus: string;
  sessionId?: string;
  priority: string;
  acceptableFatigue: string;
};

export type ProgramAdaptation = {
  title: string;
  description: string;
};

export type WeeklyProgram = {
  id: string;
  title: string;
  status: string;
  purpose: string;
  context: string;
  days: ProgramDay[];
  adaptations: ProgramAdaptation[];
};

export function isWeeklyProgram(value: unknown): value is WeeklyProgram {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    Array.isArray(candidate.days) &&
    candidate.days.length > 0
  );
}
