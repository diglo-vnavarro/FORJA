import { ASSESSMENT_SOURCES } from "./assessmentDocuments";
import { parseAssessmentDocument } from "./assessmentDocumentParser";
import type { Assessment } from "../domain/assessment";

const parsedAssessments = ASSESSMENT_SOURCES.map(parseAssessmentDocument);

export const assessmentDocumentProblems: string[] = parsedAssessments.flatMap((parsed) => parsed.problems);

if (import.meta.env.DEV && assessmentDocumentProblems.length > 0) {
  console.warn("Problemas al cargar las evaluaciones desde Markdown:", assessmentDocumentProblems);
}

export const assessments: Assessment[] = parsedAssessments.map((parsed) => parsed.assessment);

export function getAssessmentById(idOrSlug: string): Assessment | undefined {
  const normalized = idOrSlug.trim().toLowerCase();
  return assessments.find(
    (assessment) =>
      assessment.identity.id.toLowerCase() === normalized ||
      assessment.identity.slug.toLowerCase() === normalized
  );
}
