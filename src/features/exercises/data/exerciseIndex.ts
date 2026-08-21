import type { ExerciseIndexEntry } from "@/features/exercises/domain/exercise";
import { exercises } from "./exercises";

const conceptualNames = [
  "Salto vertical + estabilización", "Salto horizontal + estabilización", "Pogo bilateral", "Caída baja + estabilización", "Aceleración corta", "Sprint de mayor exposición", "Aceleración + parada en zona", "COD preplanificado de ángulo pequeño/moderado", "COD preplanificado de ángulo grande", "COD reactivo simple",
];

export const exerciseIndex: ExerciseIndexEntry[] = [
  ...exercises.map((exercise) => ({ id: exercise.identity.id, displayName: exercise.identity.displayName, contentStatus: exercise.identity.contentStatus, source: exercise.traceability.sources[0] })),
  ...conceptualNames.map((displayName, index) => ({ id: `EX-${String(index + 16).padStart(3,"0")}`, displayName, contentStatus: "conceptual" as const, source: "docs/05-exercises/initial-exercise-library.md" })),
];
