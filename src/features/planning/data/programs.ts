import type { WeeklyProgram } from "../domain/program";
import { parseProgramDocument } from "./programDocumentParser";
import { PROGRAM_SOURCES } from "./programDocuments";

export type ProgramCatalogEntry = {
  program: WeeklyProgram;
  slug: string;
  sourcePath: string;
};

const parsedEntries: ProgramCatalogEntry[] = [];
export const programDocumentProblems: { sourcePath: string; problems: string[] }[] = [];

for (const source of PROGRAM_SOURCES) {
  const result = parseProgramDocument(source);
  if (result.problems.length > 0) {
    programDocumentProblems.push({
      sourcePath: source.sourcePath,
      problems: result.problems,
    });
    if (import.meta.env.DEV) {
      console.warn(`Problemas al parsear ${source.sourcePath}:`, result.problems);
    }
  } else if (result.program) {
    parsedEntries.push({
      program: result.program,
      slug: source.slug,
      sourcePath: source.sourcePath,
    });
  }
}

export const programs: WeeklyProgram[] = parsedEntries.map((e) => e.program);

export function getProgramById(id: string): WeeklyProgram | undefined {
  return programs.find((p) => p.id === id);
}

export function getProgramCatalogEntries(): ProgramCatalogEntry[] {
  return parsedEntries;
}
