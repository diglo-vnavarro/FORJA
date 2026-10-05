import { findGlossaryTerm } from "@/features/search/data/glossaryDocuments";
import type { GlossaryTerm } from "@/features/search/domain/glossary";
import { ForjaIcon } from "@/design-system/forja/src/icons";

export interface GlossaryTermChipProps {
  termName: string;
  onOpenTerm: (term: GlossaryTerm) => void;
  label?: string;
}

export function GlossaryTermChip({ termName, onOpenTerm, label }: GlossaryTermChipProps) {
  const term = findGlossaryTerm(termName);
  if (!term) return null;

  return (
    <button
      type="button"
      className="glossary-term-chip"
      onClick={() => onOpenTerm(term)}
      aria-label={`Consultar definición de ${label ?? term.title}`}
    >
      <ForjaIcon name="glossary" size={14} className="glossary-term-chip__icon" />
      <span>{label ?? (term.acronym ?? term.title)}</span>
    </button>
  );
}
