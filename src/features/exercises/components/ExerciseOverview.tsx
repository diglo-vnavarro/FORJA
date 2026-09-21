import { ForjaIcon, type ForjaIconName } from "@/design-system/forja/src/icons";
import type { Exercise } from "@/features/exercises/domain/exercise";

type OverviewItem = { label: string; value: string; icon: ForjaIconName };

export function ExerciseOverview({ exercise }: { exercise: Exercise }) {
  const primaryCapability = exercise.classification.capabilities[0];
  const primaryEquipment = exercise.context.equipment[0];
  const prescription = exercise.prescription.variables.slice(0, 3).map((item) => item.label).join(" · ");
  const keyCue = exercise.coaching.cues[0];
  const items: OverviewItem[] = [
    primaryCapability && { label: "Capacidad", value: primaryCapability.label, icon: primaryCapability.icon ?? "strength" },
    primaryEquipment && { label: "Equipamiento", value: primaryEquipment.label, icon: primaryEquipment.icon ?? "externalLoad" },
    { label: "Patrón", value: exercise.classification.movementPattern.label, icon: "technique" },
    { label: "Objetivo", value: exercise.identity.objective, icon: "intention" },
    prescription && { label: "Prescripción", value: prescription, icon: "sets" },
    keyCue && { label: "Coaching clave", value: keyCue, icon: "quality" },
  ].filter(Boolean) as OverviewItem[];

  return <section aria-label="Resumen del ejercicio"><dl className="exercise-overview">
    {items.map((item) => <div className="exercise-overview__item" key={item.label}><ForjaIcon name={item.icon} size={20}/><div><dt>{item.label}</dt><dd>{item.value}</dd></div></div>)}
  </dl></section>;
}
