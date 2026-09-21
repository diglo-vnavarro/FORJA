import type { Exercise, ExerciseRelation, PrescriptionVariable } from "@/features/exercises/domain/exercise";
import type { ForjaIconName } from "@/design-system/forja/src/icons";

export const meaningfulItems = (items: string[]) => items.filter((item) => item.trim().length > 0 && !item.trim().endsWith(":"));
const compact = (items: string[], limit: number) => meaningfulItems(items).slice(0, limit);

const relationItems = (items: ExerciseRelation[], limit: number) => items
  .filter((item, index, all) => item.label.trim().length > 0 && all.findIndex((candidate) => candidate.label === item.label) === index)
  .slice(0, limit);

const stepLabel = (text: string, index: number) => {
  const normalized = text.toLocaleLowerCase("es");
  if (index === 0) return "Prepara";
  if (normalized.includes("control") || normalized.includes("rango") || normalized.includes("mant")) return "Controla";
  if (/apoyo|pie.+plataforma/i.test(normalized)) return "Apoya";
  if (normalized.includes("descenso") || normalized.includes("descend") || normalized.includes("baja") || normalized.includes("flexi")) return "Desciende";
  if (normalized.includes("volver") || normalized.includes("sub") || normalized.includes("ascend") || normalized.includes("eleva") || normalized.includes("produce fuerza")) return "Sube";
  return index === 3 ? "Finaliza" : "Ejecuta";
};

type ContextMetric = { value: string; label: string; icon?: ForjaIconName };
const contextualMetrics = (items: string[]): ContextMetric[] => {
  const metrics: ContextMetric[] = [];
  for (const item of meaningfulItems(items)) {
    const normalized = item.toLocaleLowerCase("es");
    const value = item.match(/\d+(?:\s*[–-]\s*\d+)?/)?.[0]?.replace(/\s/g, "");
    if (normalized.includes("serie")) metrics.push({ value: value ?? "—", label: "Series", icon: "sets" });
    else if (normalized.includes("repet")) metrics.push({ value: value ?? "—", label: "Repeticiones", icon: "repetitions" });
    else if (normalized.includes("margen") || normalized.includes("fallo")) metrics.push({ value: "RIR", label: "Margen antes del fallo", icon: "rir" });
    else if (normalized.includes("descanso") || normalized.includes("recuper")) metrics.push({ value: "", label: "Recuperación suficiente", icon: "recovery" });
    else if (normalized.includes("carga")) metrics.push({ value: "", label: "Carga apropiada", icon: "externalLoad" });
  }
  return metrics.slice(0, 5);
};

export const visiblePrescription = (exercise: Exercise, keys?: string[]): PrescriptionVariable[] => {
  const available = exercise.prescription.variables.filter((metric) => metric.label.trim().length > 0);
  if (!keys) return available;
  return keys.flatMap((key) => available.filter((metric) => metric.kind.type === "standard" && metric.kind.key === key));
};

export function buildExerciseDerivativeContent(exercise: Exercise) {
  const executionSource = meaningfulItems([...exercise.coaching.setup.slice(0, 1), ...exercise.coaching.execution]);
  const phaseLabels = exercise.media.masterImage.phases?.filter(Boolean) ?? ["Fase principal"];
  const phasePattern = (label: string) => /apoyo/i.test(label) ? /apoyo|pie.+plataforma/i : /subida|ascenso/i.test(label) ? /sub|ascend|eleva|produce fuerza/i : /descenso/i.test(label) ? /descenso|descend|baja|flexi/i : new RegExp(label, "i");
  const phaseExecution = phaseLabels.slice(1).map((label) => executionSource.find((item) => phasePattern(label).test(item)));
  const executionSteps = [executionSource[0], ...phaseExecution, executionSource.find((item) => /control|rango|mant/i.test(item)), executionSource.find((item) => /volver|sub|ascend|produce fuerza/i.test(item)), ...executionSource]
    .filter((item, index, items): item is string => Boolean(item) && items.indexOf(item) === index)
    .slice(0, 4)
    .map((text, index) => ({ label: stepLabel(text, index), text }));
  return {
    identity: exercise.identity,
    primaryCapability: exercise.classification.capabilities[0],
    pattern: exercise.classification.movementPattern,
    attributes: exercise.classification.attributes.filter((item) => item.content.length > 0),
    equipment: exercise.context.equipment,
    execution: compact(exercise.coaching.execution, 4),
    cues: compact(exercise.coaching.cues, 5),
    competency: compact(exercise.coaching.competencyIndicators, 3),
    errors: compact(exercise.coaching.commonErrors, 3),
    variations: compact(exercise.coaching.acceptableVariations, 3),
    prescription: visiblePrescription(exercise),
    sessionPrescription: visiblePrescription(exercise, ["sets", "repetitions", "load", "rpe", "rir", "recovery"]),
    contextualExample: compact(exercise.prescription.contextualExample, 6),
    stopCriterion: meaningfulItems(exercise.coaching.stopCriteria)[0],
    executionSteps,
    coachingTriad: {
      competency: compact(exercise.coaching.competencyIndicators, 5),
      modify: compact([...exercise.coaching.commonErrors, ...exercise.coaching.stopCriteria], 5),
      acceptable: compact(exercise.coaching.acceptableVariations, 4),
    },
    adaptations: {
      accessible: relationItems(exercise.relations.regressions, 4),
      demand: relationItems(exercise.relations.progressions, 4),
    },
    contextMetrics: contextualMetrics(exercise.prescription.contextualExample),
    footerMessage: exercise.prescription.contextNote,
    phaseLabels,
  };
}
