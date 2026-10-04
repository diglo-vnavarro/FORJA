import rawGlossaryMarkdown from "../../../../docs/01-foundations/glossary.md?raw";
import {
  parseGlossaryMarkdown,
  type GlossaryParseResult,
  type GlossaryTerm,
} from "@/features/search/domain/glossary";

export const glossaryParseResult: GlossaryParseResult = parseGlossaryMarkdown(rawGlossaryMarkdown);

if (import.meta.env.DEV && glossaryParseResult.problems.length > 0) {
  console.warn("Problemas detectados al analizar el glosario:", glossaryParseResult.problems);
}

export const glossaryTerms: GlossaryTerm[] = glossaryParseResult.terms;

export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug);
}
