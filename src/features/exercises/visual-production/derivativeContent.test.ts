import { describe, expect, it } from "vitest";
import type { Exercise } from "@/features/exercises/domain/exercise";
import { buildExerciseDerivativeContent, meaningfulItems, visiblePrescription } from "./derivativeContent";

const exercise = {
  identity: { id: "EX-TEST", slug: "test", name: "Test", displayName: "Test", aliases: [], description: "", objective: "", contentStatus: "usable" },
  classification: { category: "", movementPattern: { id: "push", label: "Empuje" }, secondaryPatterns: [], capabilities: [], attributes: [] },
  context: { equipment: [], environment: [], space: [], surface: [], requirements: [] },
  media: { status: "partial", masterImage: { status: "approved", src: "/master.webp" }, thumbnail: { status: "missing" }, infographic: { status: "missing" }, sessionCard: { status: "missing" }, visualBrief: { status: "available" } },
  prescription: { variables: [
    { kind: { type: "standard", key: "time" }, label: "Tiempo", icon: "time" },
    { kind: { type: "standard", key: "distance" }, label: "Distancia", icon: "distance" },
    { kind: { type: "specific", key: "side" }, label: "" },
  ], contextualExample: ["Ejemplo:", "20 segundos"] },
  coaching: { setup: [], execution: [], cues: ["Ejemplos:", "Consigna útil"], competencyIndicators: [], commonErrors: [], acceptableVariations: [], stopCriteria: ["Modificar cuando:", "Aparezca dolor"], observations: [] },
  decision: { chooseWhen: [], avoidWhen: [] },
  relations: { regressions: [], progressions: [], substitutions: [], variations: [], relatedExercises: [] },
  safety: { requirements: [], warnings: [], stopCriteria: [] },
  whatToRecord: [], traceability: { sources: [], methodologicalNotes: [], evidenceNotes: [] },
} as Exercise;

describe("exercise derivative content", () => {
  it("removes editorial leads and empty labels", () => {
    expect(meaningfulItems(["Ejemplos:", "", "Contenido"])).toEqual(["Contenido"]);
    const content = buildExerciseDerivativeContent(exercise);
    expect(content.cues).toEqual(["Consigna útil"]);
    expect(content.contextualExample).toEqual(["20 segundos"]);
    expect(content.stopCriterion).toBe("Aparezca dolor");
    expect(content.prescription.map((item) => item.label)).toEqual(["Tiempo", "Distancia"]);
  });

  it("adapts session metrics to available supported variables", () => {
    expect(visiblePrescription(exercise, ["sets", "time", "distance", "rir"]).map((item) => item.label)).toEqual(["Tiempo", "Distancia"]);
    expect(buildExerciseDerivativeContent({ ...exercise, prescription: { variables: [], contextualExample: [] } }).sessionPrescription).toEqual([]);
  });

  it("adapts phase labels and visual context metrics to the available exercise data", () => {
    expect(buildExerciseDerivativeContent(exercise).phaseLabels).toEqual(["Fase principal"]);
    const twoPhase = { ...exercise, media: { ...exercise.media, masterImage: { ...exercise.media.masterImage, phases: ["Inicio", "Descenso"] } }, prescription: { ...exercise.prescription, contextualExample: ["2–3 series", "6–8 repeticiones", "margen antes del fallo", "descanso suficiente"] } } as Exercise;
    expect(buildExerciseDerivativeContent(twoPhase).phaseLabels).toEqual(["Inicio", "Descenso"]);
    expect(buildExerciseDerivativeContent(twoPhase).contextMetrics.map((item) => item.label)).toEqual(["Series", "Repeticiones", "Margen antes del fallo", "Recuperación suficiente"]);
    const threePhase = { ...exercise, media: { ...exercise.media, masterImage: { ...exercise.media.masterImage, phases: ["Inicio", "Apoyo", "Subida"] } } } as Exercise;
    expect(buildExerciseDerivativeContent(threePhase).phaseLabels).toEqual(["Inicio", "Apoyo", "Subida"]);
  });
});
