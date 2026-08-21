import type { ForjaIconName } from "@/design-system/forja/src/icons";

export const CAPABILITY_TAXONOMY = {
  strength: { label: "Fuerza", icon: "strength" }, forceProduction: { label: "Producción de fuerza", icon: "strength" }, motorCompetence: { label: "Competencia motriz", icon: "competence" }, unilateralUpperBodyCompetence: { label: "Competencia unilateral del tren superior", icon: "competence" }, control: { label: "Control", icon: "balanceStability" }, learning: { label: "Aprendizaje", icon: "technique" }, tolerance: { label: "Tolerancia", icon: "quality" }, stability: { label: "Estabilidad", icon: "balanceStability" }, coordination: { label: "Coordinación", icon: "coordination" }, bodyAwareness: { label: "Conciencia corporal", icon: "observe" }, grip: { label: "Agarre", icon: "strength" }, locomotion: { label: "Locomoción", icon: "speed" }, loadTransport: { label: "Transporte de carga", icon: "externalLoad" },
} as const satisfies Record<string, { label: string; icon?: ForjaIconName }>;
export type CapabilityId = keyof typeof CAPABILITY_TAXONOMY;

export const EQUIPMENT_TAXONOMY = {
  bodyweight: { label: "Peso corporal", icon: "bodyweight" }, stableSupport: { label: "Apoyo estable" }, suspensionTrainer: { label: "Sistema de suspensión" }, wallReference: { label: "Pared o referencia" }, dowel: { label: "Pica" }, dumbbell: { label: "Mancuerna", icon: "dumbbell" }, kettlebell: { label: "Kettlebell", icon: "kettlebell" }, resistanceBand: { label: "Banda elástica", icon: "resistanceBand" }, box: { label: "Cajón o banco", icon: "box" }, cableMachine: { label: "Polea o cable", icon: "externalLoad" }, mat: { label: "Colchoneta" },
} as const satisfies Record<string, { label: string; icon?: ForjaIconName }>;
export type EquipmentId = keyof typeof EQUIPMENT_TAXONOMY;

export const MOVEMENT_PATTERN_TAXONOMY = {
  kneeDominant: "Dominante de rodilla", hipHinge: "Bisagra / dominante de cadera", unilateralLunge: "Unilateral / zancada", push: "Empuje", pull: "Tracción", trunkStabilityCarry: "Tronco / estabilización / transporte", jump: "Salto", landing: "Aterrizaje", accelerationSprint: "Aceleración y sprint", deceleration: "Desaceleración", changeOfDirectionAgility: "Cambio de dirección y agilidad",
} as const;
export type MovementPatternId = keyof typeof MOVEMENT_PATTERN_TAXONOMY;

export const CONTENT_STATUSES = ["conceptual", "draft", "usable"] as const;
export type ExerciseContentStatus = (typeof CONTENT_STATUSES)[number];
export const MEDIA_STATUSES = ["missing", "partial", "complete"] as const;
export type ExerciseMediaStatus = (typeof MEDIA_STATUSES)[number];
export const ASSET_STATUSES = ["missing", "draft", "available", "approved"] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

// Domain concepts without a faithful semantic icon in ForjaIconName.
// They remain valid taxonomy values and are rendered without an improvised icon.
export const MISSING_FORJA_ICON = [
  "stableSupport", "suspensionTrainer", "wallReference", "dowel", "cableMachine", "mat",
  "assistance", "height", "support", "side", "alternation", "density", "feedback",
  "bandResistance", "anchorDistance", "stance", "lever", "grip", "turns", "variant", "bodyPosition",
] as const;
