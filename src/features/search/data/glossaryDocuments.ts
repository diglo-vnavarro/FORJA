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

export function findGlossaryTerm(termOrKeyword: string): GlossaryTerm | undefined {
  const normalized = termOrKeyword.trim().toLowerCase();
  return glossaryTerms.find((t) => {
    if (t.acronym && t.acronym.toLowerCase() === normalized) return true;
    if (t.title.toLowerCase() === normalized) return true;
    if (t.slug === normalized) return true;
    if (
      t.title.toLowerCase().startsWith(normalized + " —") ||
      t.title.toLowerCase().startsWith(normalized + " -")
    ) {
      return true;
    }
    return false;
  });
}

export function getGlossaryCategories(): string[] {
  const categories = new Set<string>();
  for (const term of glossaryTerms) {
    if (term.category) categories.add(term.category);
  }
  return Array.from(categories);
}
