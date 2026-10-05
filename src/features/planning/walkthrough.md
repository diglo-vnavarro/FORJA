# Walkthrough — Módulo de Programación y Vista Semanal de Calendario Deportivo (F6-02)

## Objetivo

Activar la funcionalidad de **Programación** (`/planning`) en la SPA de FORJA, permitiendo visualizar los microciclos y programas semanales canónicos parseados directamente desde la documentación metodológica (`docs/07-programs/`), estructurando los días en función del calendario deportivo y la distancia a la competición (`MD-x`, `MD+x`, `MD`, `Off`), con accesos directos para consultar y preparar las sesiones asignadas.

Queda fuera de esta tarea:
- La generación automática de entrenamientos o algoritmos de reajuste en tiempo real (bloqueados metodológicamente por DEC-E en Fase 7).
- La edición libre de calendarios en `localStorage` (reservada para iteraciones de personalización del deportista).

## Decisiones tomadas

1. **Arquitectura estricta feature-based (`pages → components → data → domain`)**:
   - `domain/program.ts`: Modelos de datos (`WeeklyProgram`, `ProgramDay`, `ProgramAdaptation`) y validador de tipo seguro `isWeeklyProgram`. Sin dependencias de UI ni persistencia.
   - `data/programDocumentParser.ts` y `data/programs.ts`: El documento Markdown es la fuente de verdad. Se importan con `?raw` sin duplicar texto ni prescripciones en TypeScript. Se valida que la lista de `problems` esté vacía.
   - `components/WeeklyCalendarView.tsx`: Componente de presentación reutilizable para la rejilla semanal, diferenciando visualmente el día de partido (`MD`), días con sesión FORJA y días de club o descanso mediante tokens e iconografía semántica oficial (`ForjaIcon`).
   - `pages/PlanningPage.tsx`: Pantalla principal enlazada en el router que coordina la selección de programas, propósito, contexto, calendario y criterios de adaptación dinámica.
2. **Nomenclatura basada en MET-005**:
   - Etiquetas de proximidad a competición normalizadas: `MD-5`, `MD-4`, `MD-3`, `MD-2`, `MD-1`, `MD`, `MD+1`, etc.
   - No se emplean recetas rígidas: se destacan los criterios de adaptación dinámica (minutos disputados, fatiga por exámenes, criterios de parada).
3. **Integración con flujos existentes de la aplicación**:
   - Enlace directo desde los días con sesión FORJA hacia la consulta canónica (`/sessions/:sessionId`) y hacia el preparador de borradores (`/sessions/prepare?template=:sessionId`).
   - Activación del módulo en el menú de navegación y en el Dashboard (`ready: true`).

## Archivos modificados

- `src/features/planning/domain/program.ts`: Definición de tipos y validadores para programas, días y adaptaciones.
- `src/features/planning/data/programDocumentParser.ts`: Parser tipado para extraer metadatos, tabla semanal y adaptaciones desde Markdown.
- `src/features/planning/data/programDocuments.ts`: Registro de fuentes Markdown de programas (`PROG-001`, `PROG-002`).
- `src/features/planning/data/programs.ts`: Catálogo de programas parseados y selectores.
- `src/features/planning/data/programs.test.ts`: Pruebas de integridad del parser y verificación de ausencia de problemas (`problems: []`).
- `src/features/planning/components/WeeklyCalendarView.tsx`: Vista en rejilla de los 7 días con badges MD y enlaces a sesiones.
- `src/features/planning/pages/PlanningPage.tsx`: Pantalla de programación semanal con selector de programas y adaptaciones.
- `src/features/planning/pages/PlanningPage.test.tsx`: Pruebas de integración de la interfaz, cambio de programa y enlaces.
- `src/styles/components.css`: Estilos para el módulo de programación y tarjetas de día de calendario.
- `src/app/router.tsx`: Registro de la ruta activa `/planning` mediante carga perezosa (`lazyComponent`).
- `src/pages/DashboardPage.tsx`: Módulo Programación activado con `ready: true`.
- `docs/00-project/implementation-plan.md`: Tarea F6-02 marcada como Hecha.
- `src/features/planning/walkthrough.md`: Memoria técnica del módulo.

## Verificación

Se ejecutaron las 5 comprobaciones obligatorias de FORJA:

1. `npm run typecheck`: 0 errores en TypeScript estricto.
2. `npm run lint`: 0 advertencias y 0 errores de ESLint.
3. `npm test`: 55 archivos probados, 253 tests pasando exitosamente (incluidos los 9 nuevos tests de `planning`).
4. `npm run build`: Compilación exitosa en Vite.
5. `npm run check:links`: 138 archivos Markdown, 1159 enlaces relativos verificados, 0 problemas.

## Pendiente

- Fase 7 (Motor de adaptación): Bloqueada por la toma y registro de la decisión metodológica DEC-E.
