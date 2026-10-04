# Walkthrough F3-01 — Índice de búsqueda global a partir de Markdown

## Objetivo
Implementar la tarea F3-01 del plan de implementación: construir el índice de búsqueda unificado y en memoria de FORJA generado directamente a partir del Markdown y los catálogos ya cargados (sin servicios externos ni dependencias de red), permitiendo buscar ejercicios, sesiones y términos del glosario por nombre, alias, patrón de movimiento, capacidad física y material.

## Decisiones tomadas
1. **Dominio de búsqueda desacoplado (`src/features/search/domain/searchIndex.ts`)**:
   - Algoritmo de normalización de cadenas (`normalizeSearchText`) que ignora mayúsculas y diacríticos/tildes en español.
   - Puntuación ponderada que prioriza coincidencias exactas por ID o nombre, alias conocidos, patrones de movimiento, capacidades y material/equipamiento.
   - Filtro tipado opcional por tipo de recurso (`"exercise" | "session" | "glossary"`).
2. **Parser canónico del glosario (`src/features/search/domain/glossary.ts` y `data/glossaryDocuments.ts`)**:
   - Lee e interpreta `docs/01-foundations/glossary.md` directamente mediante Vite `?raw`.
   - Extrae términos, siglas, categorías alfabéticas, definiciones iniciales, decisiones FORJA asociadas, fuentes y términos relacionados.
   - La comprobación de integridad exige que no existan problemas detectados (`problems: []`).
3. **Catálogo de búsqueda unificado (`src/features/search/data/searchCatalog.ts`)**:
   - Construye el índice combinando ejercicios (`src/features/exercises/data/exercises`), sesiones (`src/features/sessions/data/sessions`) y el glosario.
   - Mantiene el índice memoizado en memoria para rendimiento instantáneo en el navegador.

## Archivos modificados y creados
- `src/features/search/domain/searchIndex.ts`: Tipos, normalizador y función de puntuación de búsqueda `searchIndex`.
- `src/features/search/domain/searchIndex.test.ts`: 10 pruebas unitarias de búsqueda por ID, nombre, alias, patrón, capacidad, material y filtros.
- `src/features/search/domain/glossary.ts`: Modelo de datos y parser Markdown para el glosario metodológico.
- `src/features/search/domain/glossary.test.ts`: Pruebas unitarias de parsing, slugs y metadatos de glosario.
- `src/features/search/data/glossaryDocuments.ts`: Lectura estática del archivo `docs/01-foundations/glossary.md`.
- `src/features/search/data/searchCatalog.ts`: Constructor de índice unificado y función `searchCatalog`.
- `src/features/search/data/searchCatalog.test.ts`: Pruebas de integración sobre el contenido canónico de ejercicios, sesiones y glosario.
- `docs/00-project/implementation-plan.md`: Marcada la tarea F3-01 como completada.

## Verificación
1. `npm run typecheck`: OK (0 errores).
2. `npm run lint`: OK (0 errores).
3. `npm test`: OK (23 suites, 88 pruebas superadas).
4. `npm run build`: OK (build de producción completado).
5. `npm run check:links`: OK (113 archivos Markdown, 1016 enlaces, 0 problemas).

## Pendiente
- F3-02: Interfaz de búsqueda global (campo en barra de escritorio, pantalla completa en móvil y atajo de teclado).
- F3-03: Glosario navegable en la aplicación.
