import type { Exercise } from "@/features/exercises/domain/exercise";

export type ExerciseFilters = { query: string; capability: string; equipment: string; movementPattern: string };

const exerciseNumber = (id: string) => {
  const match = id.match(/^EX-(\d+)$/i);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
};

export const compareExerciseIds = (left: string, right: string) => {
  const numericDifference = exerciseNumber(left) - exerciseNumber(right);
  return numericDifference || left.localeCompare(right, "es", { numeric: true });
};

export const sortExercisesById = (collection: Exercise[]) => [...collection].sort((left, right) => compareExerciseIds(left.identity.id, right.identity.id));

export function filterExercises(collection: Exercise[], filters: ExerciseFilters) {
  const query = filters.query.trim().toLocaleLowerCase("es");
  return sortExercisesById(collection.filter((exercise) => {
    const searchable = [exercise.identity.displayName, ...exercise.identity.aliases, exercise.identity.description].join(" ").toLocaleLowerCase("es");
    return (!query || searchable.includes(query))
      && (filters.capability === "all" || exercise.classification.capabilities.some((item) => item.id === filters.capability))
      && (filters.equipment === "all" || exercise.context.equipment.some((item) => item.id === filters.equipment))
      && (filters.movementPattern === "all" || exercise.classification.movementPattern.id === filters.movementPattern);
  }));
}

export const uniqueTerms = <T extends { id: string; label: string }>(terms: T[]) => [...new Map(terms.map((term) => [term.id, term])).values()].sort((a,b) => a.label.localeCompare(b.label,"es"));
