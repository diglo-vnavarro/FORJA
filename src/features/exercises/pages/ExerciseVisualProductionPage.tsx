import { useParams, useSearchParams } from "react-router-dom";
import { getExerciseById } from "@/features/exercises/data/exercises";
import { visualProductionManifest } from "@/features/exercises/data/visualProductionManifest";
import { ExerciseDerivativeQaRenderer, ExerciseInfographicRenderer, ExerciseInfographicV21ComparisonRenderer, ExerciseInfographicV21Renderer, ExerciseSessionCardRenderer, ExerciseThumbnailRenderer } from "@/features/exercises/visual-production/ExerciseDerivativeRenderers";

export function ExerciseVisualProductionPage() {
  const { exerciseId = "" } = useParams();
  const [params] = useSearchParams();
  const exercise = getExerciseById(exerciseId);
  if (!exercise) return <main data-export-error>Exercise not found</main>;
  const format = params.get("format") ?? "qa";
  const production = visualProductionManifest.find((entry) => entry.id === exercise.identity.id);
  const validationExercise = getExerciseById(params.get("compare") ?? "");
  return <main className="visual-production-page">
    {format === "thumbnail" && <ExerciseThumbnailRenderer exercise={exercise} />}
    {format === "infographic" && <ExerciseInfographicRenderer exercise={exercise} />}
    {format === "infographic-v2-1" && <ExerciseInfographicV21Renderer exercise={exercise} />}
    {format === "infographic-v2-1-comparison" && production?.infographicV1Path && validationExercise && <ExerciseInfographicV21ComparisonRenderer exercise={exercise} previousPath={production.infographicV1Path} validationExercise={validationExercise} />}
    {format === "session-card" && <ExerciseSessionCardRenderer exercise={exercise} />}
    {format === "qa" && <ExerciseDerivativeQaRenderer exercise={exercise} />}
  </main>;
}
