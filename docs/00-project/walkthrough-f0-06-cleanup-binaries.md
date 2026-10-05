# Walkthrough — F0-06 / DEC-F: Limpieza de binarios no referenciados en assets/

## 1. Objetivo
- Qué resuelve:
  - Eliminación de aproximadamente 13 MB de binarios no referenciados y redundantes en el directorio `assets/`.
  - Registro de la decisión formal D-019 (DEC-F) en `docs/00-project/decisions.md`.
  - Actualización de `assets/references/visual/ex-002/README.md` documentando la nueva estructura limpia sin el archivo ZIP redundante.
  - Creación de pruebas de higiene en `src/features/exercises/data/visualProductionManifest.test.ts` asegurando que no se reintroduzcan binarios redundantes y que los conceptos referenciados se mantengan intactos.
- Qué queda fuera:
  - Modificación de los masters oficiales en WebP de ejercicios (`assets/exercises/*/master/*.webp`), que permanecen aprobados e intactos.
  - Modificación de los vectores y manuales de marca (`assets/brand/`).

## 2. Decisiones tomadas
- **D-019 (DEC-F)**:
  - Eliminación del archivo `.zip` redundante `assets/references/visual/ex-002/forja-visual-reference-ex002.zip` (5,8 MB).
  - Eliminación del duplicado `assets/references/visual/ex-002/source/` (1,5 MB) y del estilo no referenciado en `extracted/forja_visual_pack_ex002/references/` (1,5 MB).
  - Eliminación de los archivos intermedios de candidatos de generación obsoletos en `assets/exercises/ex-005/`, `ex-006/` y `ex-007/` (~6,8 MB), sustituidos por los masters WebP aprobados.
  - Eliminación del directorio vacío huérfano `assets/visual/`.
  - Preservación íntegra de los 3 conceptos referenciados en `assets/manifest.md` y `manual-pdf.cjs`.

## 3. Archivos modificados y eliminados
- `docs/00-project/decisions.md`: Registro de la decisión D-019 (DEC-F).
- `docs/00-project/implementation-plan.md`: Marcado de la tarea F0-06 como completada.
- `assets/references/visual/ex-002/README.md`: Actualización explicativa de la estructura sin el archivo ZIP.
- `src/features/exercises/data/visualProductionManifest.test.ts`: Test automatizado de higiene binaria DEC-F y preservación de referencias.
- Eliminados de Git:
  - `assets/references/visual/ex-002/forja-visual-reference-ex002.zip`
  - `assets/references/visual/ex-002/source/ex-002-infographic-style-reference-v1.png`
  - `assets/references/visual/ex-002/extracted/forja_visual_pack_ex002/references/ex-002-infographic-style-reference-v1.png`
  - `assets/exercises/ex-005/source/ex-005-split-squat-candidate-2026-08-26.png`
  - `assets/exercises/ex-005/source/ex-005-split-squat-candidate-round-2-2026-08-26.png`
  - `assets/exercises/ex-006/source/ex-006-reverse-lunge-candidate-2026-08-26.png`
  - `assets/exercises/ex-007/source/ex-007-step-up-candidate-2026-08-26.png`

## 4. Verificación
- `npm run typecheck`: OK (0 errores).
- `npm run lint`: OK (0 errores).
- `npm test`: OK (20 suites, 74 tests aprobados).
- `npm run build`: OK (build de producción limpio).
- `npm run check:links`: OK (113 archivos Markdown, 0 problemas de enlaces).

## 5. Pendiente
- Ninguna acción pendiente para F0-06.
