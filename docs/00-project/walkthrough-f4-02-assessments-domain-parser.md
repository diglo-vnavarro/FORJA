# Walkthrough — Tarea F4-02: Modelo de dominio y lectura de evaluaciones desde Markdown

## Objetivo

Implementar la capa de dominio (`domain/`) y de lectura de datos (`data/`) para las evaluaciones canónicas en `src/features/assessments/`, consumiendo directamente las fichas en Markdown de `docs/08-assessments/` sin duplicar contenido en TypeScript, con `problems` vacío y trazabilidad completa con los ejercicios referenciados.

## Decisiones tomadas

1. **Modelo de dominio en `domain/assessment.ts`**:
   - `Assessment`, `AssessmentIdentity`, `AssessmentRequirement`, `AssessmentTask`, `AssessmentTaskCriteria` y `AssessmentTaskDecision`.
   - Modela los 3 estados canónicos de competencia motriz (`sufficient`, `partial`, `insufficient`) y las ramas de derivación técnica hacia la biblioteca de ejercicios (`EX-NNN`).
2. **Parser robusto en `data/assessmentDocumentParser.ts`**:
   - Extrae de forma estructurada identidad, estado, propósito, pregunta operativa, requisitos de aplicación, criterios de exclusión/seguridad, las 8 tareas motrices con sus consignas, observaciones y criterios, y el resumen de toma de decisiones.
   - Detecta cualquier omisión o incoherencia estructural reportándola en `problems: string[]`.
3. **Catálogo y selector en `data/assessments.ts`**:
   - Exporta la lista canónica `assessments`, el array `assessmentDocumentProblems` y la función de búsqueda `getAssessmentById(idOrSlug)`.
4. **Verificación unitaria en `data/assessments.test.ts`**:
   - Comprueba que `assessmentDocumentProblems` está vacío (`[]`).
   - Valida que todos los ejercicios referenciados en las decisiones existen en `exercises`.
   - Verifica el parseo completo de las 8 tareas y sus criterios de valoración.
   - Comprueba la detección de errores ante documentos mal formados.

## Archivos modificados

- `src/features/assessments/domain/assessment.ts`: Tipos del modelo de dominio de evaluaciones.
- `src/features/assessments/data/assessmentDocuments.ts`: Manifiesto de fuentes Markdown (`eval-001-initial-movement-competence.md?raw`).
- `src/features/assessments/data/assessmentDocumentParser.ts`: Parser de Markdown a modelo de dominio con detección de anomalías.
- `src/features/assessments/data/assessments.ts`: Catálogo de evaluaciones y selectores.
- `src/features/assessments/data/assessments.test.ts`: Suite de tests de integridad y resolución de ejercicios.
- `docs/00-project/implementation-plan.md`: Marca F4-02 como **Hecha**.

## Verificación

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run check:links`
