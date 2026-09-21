import assistedSquatImage from "@/../assets/exercises/ex-001/master/ex-001-assisted-squat-master.webp";
import gobletImage from "@/../assets/exercises/ex-002/master/ex-002-goblet-squat-master.webp";
import gobletThumbnail from "@/../assets/exercises/ex-002/web/ex-002-goblet-squat-thumbnail.webp";
import hipHingeImage from "@/../assets/exercises/ex-003/master/ex-003-hip-hinge-master.webp";
import dumbbellRdlImage from "@/../assets/exercises/ex-004/master/ex-004-dumbbell-rdl-master.webp";
import splitSquatImage from "@/../assets/exercises/ex-005/master/ex-005-split-squat-master.webp";
import reverseLungeImage from "@/../assets/exercises/ex-006/master/ex-006-reverse-lunge-master.webp";
import stepUpImage from "@/../assets/exercises/ex-007/master/ex-007-step-up-master.webp";
import pushUpImage from "@/../assets/exercises/ex-008/master/ex-008-push-up-master.webp";
import singleArmPressImage from "@/../assets/exercises/ex-009/master/ex-009-single-arm-dumbbell-press-master.webp";
import bandRowImage from "@/../assets/exercises/ex-010/master/ex-010-band-row-master.webp";
import suspensionRowImage from "@/../assets/exercises/ex-011/master/ex-011-suspension-row-master.webp";
import singleArmRowImage from "@/../assets/exercises/ex-012/master/ex-012-single-arm-dumbbell-row-master.webp";
import frontPlankImage from "@/../assets/exercises/ex-013/master/ex-013-front-plank-master.webp";
import pallofPressImage from "@/../assets/exercises/ex-014/master/ex-014-pallof-press-master.webp";
import suitcaseCarryImage from "@/../assets/exercises/ex-015/master/ex-015-suitcase-carry-master.webp";
import type { ExerciseMedia } from "@/features/exercises/domain/exercise";
import type { AssetStatus } from "@/features/exercises/domain/taxonomies";

export const FORJA_ATHLETE_MASTER = {
  referenceExercise: "EX-002",
  standardPath: "docs/05-exercises/visual-production/FORJA-EXERCISE-VISUAL-STANDARD.md",
} as const;

export type ProductionQueueStatus = "READY_FOR_PRODUCTION" | "READY_FOR_MASTER_GENERATION";
export type BrandingReviewStatus = "BRANDING_REVIEW_REQUIRED";
export type VisualQaStatus = "PENDING_REVIEW" | "APPROVED" | "REGENERATE" | "REJECTED";
export type DerivativeQaStatus = "PENDING_REVIEW" | "APPROVED" | "REGENERATE" | "REJECTED";

export type VisualProductionEntry = {
  id: `EX-${string}`;
  slug: string;
  name: string;
  briefStatus: AssetStatus;
  productionSpecStatus: AssetStatus;
  masterImageStatus: AssetStatus;
  visualQaStatus: VisualQaStatus;
  thumbnailStatus: AssetStatus;
  infographicStatus: AssetStatus;
  sessionCardStatus: AssetStatus;
  briefPath?: string;
  productionSpecPath?: string;
  masterImagePath?: string;
  thumbnailPath?: string;
  infographicPath?: string;
  infographicReferencePath?: string;
  infographicV1Path?: string;
  sessionCardPath?: string;
  derivativeQaStatus?: Partial<{ thumbnail: DerivativeQaStatus; infographic: DerivativeQaStatus; sessionCard: DerivativeQaStatus }>;
  productionQueueStatus?: ProductionQueueStatus;
  blockingRequirements?: readonly ["productionSpec"];
  brandingReviewStatus?: BrandingReviewStatus;
  athleteMaster?: true;
  media: ExerciseMedia;
};

type ManifestSeed = Omit<VisualProductionEntry, "briefStatus" | "briefPath" | "productionSpecStatus" | "masterImageStatus" | "visualQaStatus" | "thumbnailStatus" | "infographicStatus" | "sessionCardStatus" | "media"> & { briefName: string };

const visualProductionSeeds: ManifestSeed[] = [
  { id: "EX-001", slug: "assisted-squat", name: "Sentadilla asistida", briefName: "ex-001-assisted-squat-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-001-PRODUCTION.md", masterImagePath: "assets/exercises/ex-001/master/ex-001-assisted-squat-master.webp" },
  { id: "EX-002", slug: "goblet-squat", name: "Sentadilla goblet", briefName: "ex-002-goblet-squat-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/FORJA-EXERCISE-VISUAL-STANDARD.md", masterImagePath: "assets/exercises/ex-002/master/ex-002-goblet-squat-master.webp", thumbnailPath: "assets/exercises/ex-002/web/ex-002-goblet-squat-thumbnail.webp", infographicPath: "assets/exercises/ex-002/web/ex-002-goblet-squat-infographic-v2-1.webp", infographicReferencePath: "assets/exercises/ex-002/web/ex-002-goblet-squat-web.webp", infographicV1Path: "assets/exercises/ex-002/web/ex-002-goblet-squat-infographic-v2.webp", sessionCardPath: "assets/exercises/ex-002/session/ex-002-goblet-squat-session-card.webp", athleteMaster: true, derivativeQaStatus: { thumbnail: "APPROVED", infographic: "PENDING_REVIEW", sessionCard: "PENDING_REVIEW" } },
  { id: "EX-003", slug: "hip-hinge", name: "Bisagra de cadera", briefName: "ex-003-hip-hinge-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-003-PRODUCTION.md", masterImagePath: "assets/exercises/ex-003/master/ex-003-hip-hinge-master.webp" },
  { id: "EX-004", slug: "dumbbell-rdl", name: "Peso muerto rumano con mancuernas", briefName: "ex-004-dumbbell-rdl-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-004-PRODUCTION.md", masterImagePath: "assets/exercises/ex-004/master/ex-004-dumbbell-rdl-master.webp" },
  { id: "EX-005", slug: "split-squat", name: "Split squat", briefName: "ex-005-split-squat-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-005-PRODUCTION.md", masterImagePath: "assets/exercises/ex-005/master/ex-005-split-squat-master.webp" },
  { id: "EX-006", slug: "reverse-lunge", name: "Zancada hacia atrás", briefName: "ex-006-reverse-lunge-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-006-PRODUCTION.md", masterImagePath: "assets/exercises/ex-006/master/ex-006-reverse-lunge-master.webp" },
  { id: "EX-007", slug: "step-up", name: "Step-up", briefName: "ex-007-step-up-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-007-PRODUCTION.md", masterImagePath: "assets/exercises/ex-007/master/ex-007-step-up-master.webp", infographicPath: "assets/exercises/ex-007/web/ex-007-step-up-infographic-v2-1.webp", derivativeQaStatus: { infographic: "PENDING_REVIEW" } },
  { id: "EX-008", slug: "push-up", name: "Flexión", briefName: "ex-008-push-up-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-008-PRODUCTION.md", masterImagePath: "assets/exercises/ex-008/master/ex-008-push-up-master.webp" },
  { id: "EX-009", slug: "single-arm-dumbbell-press", name: "Press unilateral por encima de la cabeza con mancuerna", briefName: "ex-009-single-arm-dumbbell-press-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-009-PRODUCTION.md", masterImagePath: "assets/exercises/ex-009/master/ex-009-single-arm-dumbbell-press-master.webp" },
  { id: "EX-010", slug: "band-row", name: "Remo con banda", briefName: "ex-010-band-row-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-010-PRODUCTION.md", masterImagePath: "assets/exercises/ex-010/master/ex-010-band-row-master.webp" },
  { id: "EX-011", slug: "suspension-row", name: "Remo en suspensión", briefName: "ex-011-suspension-row-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-011-PRODUCTION.md", masterImagePath: "assets/exercises/ex-011/master/ex-011-suspension-row-master.webp" },
  { id: "EX-012", slug: "single-arm-dumbbell-row", name: "Remo unilateral con mancuerna", briefName: "ex-012-single-arm-dumbbell-row-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-012-PRODUCTION.md", masterImagePath: "assets/exercises/ex-012/master/ex-012-single-arm-dumbbell-row-master.webp" },
  { id: "EX-013", slug: "front-plank", name: "Plancha frontal", briefName: "ex-013-front-plank-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-013-PRODUCTION.md", masterImagePath: "assets/exercises/ex-013/master/ex-013-front-plank-master.webp" },
  { id: "EX-014", slug: "pallof-press", name: "Pallof press", briefName: "ex-014-pallof-press-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-014-PRODUCTION.md", masterImagePath: "assets/exercises/ex-014/master/ex-014-pallof-press-master.webp" },
  { id: "EX-015", slug: "suitcase-carry", name: "Suitcase carry", briefName: "ex-015-suitcase-carry-visual-brief.md", productionSpecPath: "docs/05-exercises/visual-production/EX-015-PRODUCTION.md", masterImagePath: "assets/exercises/ex-015/master/ex-015-suitcase-carry-master.webp" },
];

const missingAsset = { status: "missing" } as const;
const approvedMasters = {
  "EX-001": { src: assistedSquatImage, alt: "Dos fases de una sentadilla asistida con apoyo estable: posición inicial y descenso" },
  "EX-002": { src: gobletImage, alt: "Dos fases de una sentadilla goblet con mancuerna: posición inicial y descenso", phases: ["Inicio", "Descenso"] },
  "EX-003": { src: hipHingeImage, alt: "Dos fases de una bisagra de cadera sin carga: posición inicial y bisagra" },
  "EX-004": { src: dumbbellRdlImage, alt: "Dos fases de un peso muerto rumano con mancuernas: posición inicial y bisagra de cadera" },
  "EX-005": { src: splitSquatImage, alt: "Dos fases de un split squat: posición inicial y descenso" },
  "EX-006": { src: reverseLungeImage, alt: "Inicio y posición final de una zancada hacia atrás" },
  "EX-007": { src: stepUpImage, alt: "Tres fases de un step-up: inicio, apoyo y subida", phases: ["Inicio", "Apoyo", "Subida"] },
  "EX-008": { src: pushUpImage, alt: "Dos fases de una flexión: posición superior e inferior" },
  "EX-009": { src: singleArmPressImage, alt: "Dos fases de un press unilateral con mancuerna" },
  "EX-010": { src: bandRowImage, alt: "Dos fases de un remo de pie con banda elástica" },
  "EX-011": { src: suspensionRowImage, alt: "Dos fases de un remo en suspensión" },
  "EX-012": { src: singleArmRowImage, alt: "Dos fases de un remo unilateral con mancuerna y apoyo" },
  "EX-013": { src: frontPlankImage, alt: "Plancha frontal sobre antebrazos y pies en una posición controlada" },
  "EX-014": { src: pallofPressImage, alt: "Dos fases de un Pallof press de pie con banda" },
  "EX-015": { src: suitcaseCarryImage, alt: "Suitcase carry con una mancuerna durante una marcha controlada" },
} as const;

export const visualProductionManifest: VisualProductionEntry[] = visualProductionSeeds.map(({ briefName, ...seed }) => {
  const briefPath = `docs/05-exercises/visual-briefs/${briefName}`;
  const master = approvedMasters[seed.id as keyof typeof approvedMasters];
  const hasMaster = Boolean(master);
  const hasThumbnail = Boolean(seed.thumbnailPath);
  const hasInfographic = Boolean(seed.infographicPath);
  const hasSessionCard = Boolean(seed.sessionCardPath);
  const masterImage = master ? { status: "approved" as const, src: master.src, sourcePath: seed.masterImagePath, alt: master.alt, phases: "phases" in master ? [...master.phases] : undefined } : missingAsset;

  return {
    ...seed,
    briefStatus: "available",
    briefPath,
    productionSpecStatus: seed.productionSpecPath ? "available" : "missing",
    masterImageStatus: hasMaster ? "approved" : "missing",
    visualQaStatus: "APPROVED",
    thumbnailStatus: hasThumbnail ? seed.derivativeQaStatus?.thumbnail === "APPROVED" ? "approved" : "draft" : "missing",
    infographicStatus: hasInfographic ? "draft" : "missing",
    sessionCardStatus: hasSessionCard ? "draft" : "missing",
    media: {
      status: hasMaster ? "partial" : "missing",
      masterImage,
      thumbnail: seed.id === "EX-002" ? { status: "approved", src: gobletThumbnail, sourcePath: seed.thumbnailPath, alt: master.alt } : master ? { status: "approved", src: master.src, sourcePath: seed.masterImagePath, alt: master.alt } : missingAsset,
      infographic: hasInfographic ? { status: "draft", sourcePath: seed.infographicPath } : missingAsset,
      sessionCard: hasSessionCard ? { status: "draft", sourcePath: seed.sessionCardPath } : missingAsset,
      visualBrief: { status: "available", sourcePath: briefPath },
    },
  };
});

export const getVisualProductionMedia = (id: string) => visualProductionManifest.find((entry) => entry.id === id)?.media;
