import type { ForjaIconName } from "@/design-system/forja/src/icons";
import type { AssetStatus, CapabilityId, EquipmentId, ExerciseContentStatus, ExerciseMediaStatus, MovementPatternId } from "./taxonomies";

export type TaxonomyTerm<TId extends string> = { id: TId; label: string; icon?: ForjaIconName };
export type LabeledContent = { label: string; content: string[] };
export type ExerciseIdentity = { id: string; slug: string; name: string; displayName: string; aliases: string[]; description: string; objective: string; contentStatus: ExerciseContentStatus };
export type ExerciseClassification = { category: string; movementPattern: TaxonomyTerm<MovementPatternId>; secondaryPatterns: string[]; capabilities: TaxonomyTerm<CapabilityId>[]; attributes: LabeledContent[] };
export type ExerciseContext = { equipment: TaxonomyTerm<EquipmentId>[]; environment: string[]; space: string[]; surface: string[]; requirements: string[] };
export type MediaAsset = { status: AssetStatus; src?: string; sourcePath?: string; alt?: string };
export type ExerciseMedia = { status: ExerciseMediaStatus; masterImage: MediaAsset; thumbnail: MediaAsset; infographic: MediaAsset; sessionCard: MediaAsset; visualBrief: MediaAsset };

export type StandardPrescriptionKey = "sets" | "repetitions" | "time" | "distance" | "load" | "recovery" | "rpe" | "rir" | "range" | "tempo" | "intention" | "quality";
export type SpecificPrescriptionKey = "assistance" | "height" | "support" | "side" | "alternation" | "angle" | "density" | "feedback" | "bandResistance" | "anchorDistance" | "stance" | "lever" | "grip" | "turns" | "variant" | "bodyPosition";
export type PrescriptionKind = { type: "standard"; key: StandardPrescriptionKey } | { type: "specific"; key: SpecificPrescriptionKey };
export type PrescriptionValue = { type: "exact" | "range" | "text"; value?: number; min?: number; max?: number; unit?: string; text?: string };
export type PrescriptionVariable = { kind: PrescriptionKind; label: string; icon?: ForjaIconName; description?: string; value?: PrescriptionValue };
export type ExercisePrescription = { variables: PrescriptionVariable[]; contextualExample: string[]; contextNote?: string };
export type ExerciseCoaching = { setup: string[]; execution: string[]; cues: string[]; competencyIndicators: string[]; commonErrors: string[]; acceptableVariations: string[]; stopCriteria: string[]; observations: string[] };
export type ExerciseRelation = { targetId?: string; label: string; description?: string };
export type ExerciseRelations = { regressions: ExerciseRelation[]; progressions: ExerciseRelation[]; substitutions: ExerciseRelation[]; variations: ExerciseRelation[]; relatedExercises: ExerciseRelation[] };
export type ExerciseSafety = { requirements: string[]; warnings: string[]; stopCriteria: string[] };
export type ExerciseTraceability = { sources: string[]; methodologicalNotes: string[]; evidenceNotes: string[] };

export type Exercise = {
  identity: ExerciseIdentity; classification: ExerciseClassification; context: ExerciseContext; media: ExerciseMedia; prescription: ExercisePrescription; coaching: ExerciseCoaching;
  decision: { chooseWhen: string[]; avoidWhen: string[] }; relations: ExerciseRelations; safety: ExerciseSafety; whatToRecord: string[]; traceability: ExerciseTraceability;
};
export type ExerciseIndexEntry = { id: string; displayName: string; contentStatus: ExerciseContentStatus; source: string };
