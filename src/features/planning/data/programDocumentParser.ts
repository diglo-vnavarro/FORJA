import type { ProgramDay, ProgramAdaptation, WeeklyProgram } from "../domain/program";

export type ProgramSource = {
  markdown: string;
  slug: string;
  sourcePath: string;
};

export type ParseProgramResult = {
  program: WeeklyProgram | null;
  problems: string[];
};

export function parseProgramDocument(source: ProgramSource): ParseProgramResult {
  const problems: string[] = [];
  const lines = source.markdown.split(/\r?\n/);

  // Title and ID
  const titleLine = lines.find((l) => /^#\s+PROG-\d+/.test(l));
  if (!titleLine) {
    problems.push("Falta el encabezado principal con identificador PROG-NNN");
    return { program: null, problems };
  }

  const titleMatch = titleLine.match(/^#\s+(PROG-\d+)\s*[—–-]\s*(.+)$/);
  const id = titleMatch ? titleMatch[1].trim() : "";
  const title = titleMatch ? titleMatch[2].trim() : "";

  // Helper to extract section content
  const extractSection = (headingRegex: RegExp, nextHeadingRegex: RegExp): string => {
    const startIndex = lines.findIndex((l) => headingRegex.test(l));
    if (startIndex === -1) return "";
    let content = "";
    for (let i = startIndex + 1; i < lines.length; i++) {
      if (nextHeadingRegex.test(lines[i])) break;
      content += lines[i] + "\n";
    }
    return content.trim();
  };

  const status = extractSection(/^##\s+Estado/, /^##\s+/);
  const purpose = extractSection(/^##\s+Propósito/, /^##\s+/);
  const context = extractSection(/^##\s+Contexto previsto/, /^##\s+/);

  if (!status) problems.push("Falta la sección ## Estado");
  if (!purpose) problems.push("Falta la sección ## Propósito");
  if (!context) problems.push("Falta la sección ## Contexto previsto");

  // Parse Days table from ## Esquema semanal de distribución
  const days: ProgramDay[] = [];
  const tableSection = extractSection(/^##\s+Esquema semanal de distribución/, /^##\s+/);
  if (!tableSection) {
    problems.push("Falta la sección ## Esquema semanal de distribución");
  } else {
    const tableLines = tableSection.split(/\r?\n/).filter((l) => l.trim().startsWith("|"));
    // Header is line 0, separator is line 1, data starts at line 2
    for (let i = 2; i < tableLines.length; i++) {
      const cols = tableLines[i]
        .split("|")
        .map((c) => c.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

      if (cols.length >= 6) {
        const [dayName, matchDayOffset, clubActivity, forjaStimulusRaw, priority, acceptableFatigue] = cols;

        // Check if forjaStimulus links to a session like [SES-002: ...](...)
        let sessionId: string | undefined;
        const sessionMatch = forjaStimulusRaw.match(/SES-\d+/);
        if (sessionMatch) {
          sessionId = sessionMatch[0];
        }

        // Clean link formatting from markdown for presentation
        const cleanStimulus = forjaStimulusRaw.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

        days.push({
          dayName,
          matchDayOffset,
          clubActivity,
          forjaStimulus: cleanStimulus,
          sessionId,
          priority,
          acceptableFatigue,
        });
      }
    }
  }

  if (days.length === 0) {
    problems.push("No se pudieron extraer días válidos de la tabla de distribución semanal");
  }

  // Parse adaptations from ## Criterios de adaptación dinámica
  const adaptations: ProgramAdaptation[] = [];
  const adaptationsSection = extractSection(/^##\s+Criterios de adaptación dinámica/, /^##\s+[A-Z]/);
  if (adaptationsSection) {
    const adaptationBlocks = adaptationsSection.split(/^###\s+/m).filter(Boolean);
    for (const block of adaptationBlocks) {
      const blockLines = block.trim().split(/\r?\n/);
      const adaptTitle = blockLines[0].trim();
      const adaptDesc = blockLines.slice(1).join("\n").trim();
      if (adaptTitle && adaptDesc) {
        adaptations.push({
          title: adaptTitle,
          description: adaptDesc,
        });
      }
    }
  }

  if (problems.length > 0) {
    return { program: null, problems };
  }

  const program: WeeklyProgram = {
    id,
    title,
    status,
    purpose,
    context,
    days,
    adaptations,
  };

  return { program, problems: [] };
}
