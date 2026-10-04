import { exercises } from "@/features/exercises/data/exercises";
import { sessions } from "@/features/sessions/data/sessions";
import { glossaryTerms } from "@/features/search/data/glossaryDocuments";
import {
  type SearchItem,
  type SearchResult,
  type SearchItemKind,
  searchIndex,
} from "@/features/search/domain/searchIndex";

let cachedSearchItems: SearchItem[] | null = null;

export function buildSearchIndex(): SearchItem[] {
  if (cachedSearchItems) {
    return cachedSearchItems;
  }

  const items: SearchItem[] = [];

  // 1. Ejercicios
  for (const ex of exercises) {
    items.push({
      id: ex.identity.id,
      kind: "exercise",
      title: `${ex.identity.id} · ${ex.identity.name}`,
      subtitle: ex.classification.movementPattern.label,
      url: `/exercises/${ex.identity.slug}`,
      name: ex.identity.name,
      aliases: [...ex.identity.aliases],
      pattern: ex.classification.movementPattern.label,
      capabilities: ex.classification.capabilities.map((c: { label: string }) => c.label),
      equipment: ex.context.equipment.map((e: { label: string }) => e.label),
      description: `${ex.identity.objective} ${ex.identity.description}`.trim(),
      keywords: [
        ex.classification.category,
        ...ex.classification.secondaryPatterns,
        ...ex.coaching.cues,
      ],
    });
  }

  // 2. Sesiones
  for (const ses of sessions) {
    const taskExerciseIds = ses.blocks.flatMap((b) => b.tasks.map((t) => t.exerciseId));
    items.push({
      id: ses.identity.id,
      kind: "session",
      title: `${ses.identity.id} · ${ses.identity.name}`,
      subtitle: `Sesión · ${ses.identity.status}`,
      url: `/sessions/${ses.identity.id}`,
      name: ses.identity.name,
      aliases: [],
      capabilities: [],
      equipment: [...ses.context.resources],
      description: [...ses.context.profile, ...ses.context.weekly].join(" "),
      keywords: [
        ...taskExerciseIds,
        ...ses.blocks.map((b) => b.name),
        ...ses.blocks.map((b) => b.purpose),
      ],
    });
  }

  // 3. Términos del glosario
  for (const term of glossaryTerms) {
    items.push({
      id: term.id,
      kind: "glossary",
      title: term.title,
      subtitle: `Glosario · ${term.category}`,
      url: `/glossary#${term.slug}`,
      name: term.title,
      aliases: term.acronym ? [term.acronym] : [],
      capabilities: [],
      equipment: [],
      description: term.summary,
      keywords: [...term.seeAlso],
    });
  }

  cachedSearchItems = items;
  return items;
}

export function searchCatalog(
  query: string,
  kindFilter?: SearchItemKind[],
): SearchResult[] {
  const index = buildSearchIndex();
  return searchIndex(index, query, kindFilter);
}
