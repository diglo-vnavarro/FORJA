# Walkthrough F3-03: Glosario navegable y consulta in situ en fichas de ejercicio

## 1. Objetivo

Dar respuesta a la tarea **F3-03** del plan de implementación:
- Implementar una página de Glosario (`/glossary` y `/glossary/:slug`) navegable por letra inicial, con filtrado en tiempo real y fichas informativas completas (categoría, acrónimo, definición, decisiones FORJA, términos relacionados y fuentes).
- Permitir la consulta interactiva e inmediata de los términos del glosario directamente desde la ficha de ejercicio (`ExerciseDetailPage`), sin salir de la ficha ni interrumpir el flujo del entrenador/educador mediante un panel lateral accesible (`GlossaryDrawer`).

## 2. Decisiones tomadas

1. **Consulta in situ sin abandono de contexto (`GlossaryDrawer`)**:
   - Se diseñó un panel deslizable lateral tipo *drawer* (`role="dialog"`, `aria-modal="true"`), que se abre al pulsar cualquier ficha de término en la ficha de ejercicio.
   - Cuenta con control de foco, descarte por tecla `Escape`, botón accesible de cierre y bloqueo automático del scroll de fondo.
   - Permite saltar entre términos relacionados («Véase también») dentro del propio cajón sin cerrarlo, o abrir la entrada en el glosario general mediante enlace directo (`/glossary#slug`).

2. **Detección y enlaces automáticos a conceptos metodológicos en la ficha**:
   - En `ExerciseDetailPage`, se identifican los términos clave relevantes para el ejercicio (patrón de movimiento, capacidades físicas, variables de prescripción como `1RM`, `RIR`, `RPE`, y conceptos como `Series`, `Repeticiones`, `Intensidad`, `Volumen`, `Progresión`, `Regresión` y `Criterios de parada`).
   - Se presentan en un panel específico con fichas interactivas (`GlossaryTermChip`) accesibles con teclado.

3. **Icono oficial semántico `glossary` en el sistema de diseño**:
   - Siguiendo `AGENTS.md` y `src/design-system/forja/AGENTS.md`, se incorporó `IconBook` como glifo semántico `glossary` a `ForjaIcon.tsx` y se registró en `icon-map.json`.

4. **Página de Glosario unificada y deep-linking**:
   - En `/glossary`, la vista ofrece selector de letras alfabéticas (`0–9`, `A`–`V`), buscador dinámico con descarte instantáneo y soporte para abrir directamente un término mediante parámetro de ruta (`/glossary/:slug`) o ancla (`#slug`).

## 3. Archivos modificados

- `src/design-system/forja/src/icons/ForjaIcon.tsx`: añadido glifo `glossary` (`IconBook`) y su etiqueta en español.
- `src/design-system/forja/src/icons/icon-map.json`: registro del icono `glossary`.
- `src/features/search/data/glossaryDocuments.ts`: helpers `findGlossaryTerm` y `getGlossaryCategories`.
- `src/features/search/components/GlossaryDrawer.tsx`: componente modal/drawer accesible para consultar definiciones.
- `src/features/search/components/GlossaryDrawer.test.tsx`: tests unitarios de accesibilidad y navegación interna del cajón.
- `src/features/search/components/GlossaryTermChip.tsx`: botón interactivo para consultar términos.
- `src/features/search/pages/GlossaryPage.tsx`: página de catálogo del glosario con filtrado por inicial y búsqueda.
- `src/features/search/pages/GlossaryPage.test.tsx`: tests unitarios de búsqueda, filtrado y apertura de términos.
- `src/features/exercises/pages/ExerciseDetailPage.tsx`: integración de sección de glosario metodológico y cajón de consulta in situ.
- `src/features/exercises/pages/ExerciseDetailPage.test.tsx`: test de consulta in situ sin abandonar la ficha de ejercicio.
- `src/app/router.tsx`: configuración de rutas `/glossary` y `/glossary/:slug`.
- `src/styles/global.css`: estilos para `glossary-drawer`, `glossary-card`, `glossary-term-chip`, y controles.
- `docs/00-project/implementation-plan.md`: tarea F3-03 marcada como completada.
- `docs/00-project/walkthrough-f3-03-glossary-navigation.md`: documentación de cambios.

## 4. Verificación

1. `npm run typecheck`: 0 errores.
2. `npm run lint`: 0 advertencias, 0 errores.
3. `npm test`: 26 archivos de prueba y 104 tests pasados con éxito.
4. `npm run build`: compilación limpia en 5.69s.
5. `npm run check:links`: 115 archivos, 1016 enlaces relativos comprobados, 0 problemas.

## 5. Pendiente

- Fase 4: Modelado y lectura desde Markdown de las evaluaciones metodológicas (`F4-01`, `F4-02`).
