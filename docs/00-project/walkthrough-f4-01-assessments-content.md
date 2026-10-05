# Walkthrough — Tarea F4-01: Contenido de evaluaciones a partir de MET-001

## Objetivo

Desarrollar la documentación canónica del módulo `docs/08-assessments/` a partir de [MET-001 — Evaluación inicial del joven deportista](../03-methodology/initial-athlete-assessment.md), definiendo el estándar metodológico formal de evaluación (`EVAL-STD-001`) y la primera ficha canónica de evaluación de competencia motriz (`EVAL-001`).

## Decisiones tomadas

1. **Estructura canónica `EVAL-STD-001`**:
   - Establece la separación fundamental de FORJA: «el perfil describe, las reglas deciden».
   - Fija las ocho dimensiones del joven deportista y los 3 estados de competencia motriz (Suficiente, Parcial, Insuficiente) definidos en `F-EVAL-007`.
   - Incorpora la distinción epistemológica entre «NO», «NO SÉ» y «NO MEDIDO» (MET-001 §30).
2. **Ficha canónica `EVAL-001 — Evaluación inicial de competencia motriz`**:
   - Batería mínima y accesible de 8 tareas (sentadilla, bisagra, zancada/apoyo monopodal, empuje, tracción, control de tronco, aterrizaje bipodal y frenada lineal).
   - Para cada tarea se especifican consigna al atleta, qué observar, criterios de valoración observable y decisión FORJA concreta de derivación a los ejercicios de la biblioteca (`EX-001` a `EX-015`).
   - Criterios claros de seguridad y parada inmediata (`F-EVAL-015`).
3. **Gobernanza y privacidad**:
   - Se sujeta expresamente a la decisión `D-021` (`DEC-D`): sin almacenamiento centralizado ni recolección de datos sensibles de menores.

## Archivos modificados

- `docs/08-assessments/assessment-standard.md`: Documento del estándar formal `EVAL-STD-001`.
- `docs/08-assessments/eval-001-initial-movement-competence.md`: Ficha canónica `EVAL-001`.
- `docs/08-assessments/README.md`: Índice y presentación del módulo de evaluación.
- `docs/00-project/implementation-plan.md`: Se marca la tarea F4-01 como **Hecha**.

## Verificación

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run check:links`
