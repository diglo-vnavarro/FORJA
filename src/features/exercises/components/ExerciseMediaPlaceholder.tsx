import { ForjaIcon } from "@/design-system/forja/src/icons";
import type { Exercise } from "@/features/exercises/domain/exercise";

export function ExerciseMediaPlaceholder({ exercise, compact = false }: { exercise: Exercise; compact?: boolean }) {
  const icon = exercise.classification.capabilities.find((item) => item.icon)?.icon ?? "observe";
  return <div className={`exercise-media-placeholder ${compact ? "exercise-media-placeholder--compact" : ""}`} role="img" aria-label={`Imagen en producción para ${exercise.identity.displayName}`}><div className="exercise-media-placeholder__icon"><ForjaIcon name={icon} size={compact ? 32 : 48} /></div><strong>{exercise.identity.id}</strong><b>{exercise.identity.displayName}</b><small>{exercise.classification.movementPattern.label}</small><span>Imagen en producción</span></div>;
}
