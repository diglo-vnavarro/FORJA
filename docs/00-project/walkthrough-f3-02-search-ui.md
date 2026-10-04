# Walkthrough F3-02: Interfaz de búsqueda global

## 1. Objetivo

Implementar la interfaz de usuario para el buscador global de FORJA, permitiendo acceder de forma rápida y accesible al catálogo de ejercicios, sesiones y glosario desde cualquier pantalla:
- Botón de búsqueda accesible en la barra superior (`AppShell`) con indicación visual del atajo `Ctrl+K` / `⌘K`.
- Acceso optimizado para dispositivos móviles mediante botón táctil que despliega el buscador a pantalla completa (`100dvh`).
- Atajos de teclado globales: `Ctrl+K` / `Cmd+K` para abrir/cerrar, y barra inclinada `/` para abrir directamente cuando no se está editando un campo.
- Navegación secuencial y fluida con teclado (`↑`, `↓`, `Enter`, `Escape`).
- Resultados organizados y agrupados por tipo (Ejercicios, Sesiones, Glosario) o filtrables mediante pestañas («Todos», «Ejercicios», «Sesiones», «Glosario»).
- Estado inicial con sugerencias de búsqueda y estado vacío claro y accesible cuando no hay coincidencias.

## 2. Decisiones tomadas

1. **Integración semántica con el sistema de diseño FORJA (`ForjaIcon`)**:
   - Se agregaron los conceptos semánticos `search` (`IconSearch`) y `close` (`IconX`) al mapa oficial `FORJA_ICON_MAP` en `src/design-system/forja/src/icons/ForjaIcon.tsx` y se mantuvieron sincronizados con `icon-map.json`.
   - *Alternativa descartada*: importar iconos directos de Tabler en los componentes de la funcionalidad. Descartada por contravenir las reglas de `AGENTS.md` y `src/design-system/forja/AGENTS.md`.

2. **Modal centrado en escritorio y pantalla completa en móvil**:
   - En pantallas amplias, el diálogo aparece como modal flotante sobre un fondo difuminado sin ocupar toda la pantalla.
   - En pantallas móviles (`max-width: 768px`), el diálogo ocupa el 100% de la pantalla (`100vw`, `100dvh`) para máxima ergonomía táctil en el gimnasio o campo.

3. **Navegación completa por teclado**:
   - `ArrowDown` y `ArrowUp` ciclan de forma circular por los resultados mostrados.
   - `Enter` selecciona el elemento resaltado y navega directamente a su ficha o sesión.
   - `Escape` o el botón de cierre descartan la búsqueda y restauran el scroll.

4. **Agrupación contextual por tipo**:
   - En la vista «Todos», los resultados se presentan con encabezados `h4` que especifican el tipo y la cantidad encontrada («Ejercicios (N)», «Sesiones (N)», «Glosario (N)»).

## 3. Archivos modificados

- `src/design-system/forja/src/icons/ForjaIcon.tsx`: incorporación de iconos semánticos `search` y `close` y sus etiquetas en español.
- `src/design-system/forja/src/icons/icon-map.json`: registro de `search` y `close` para sincronización con el diseño del sistema.
- `src/features/search/components/GlobalSearch.tsx`: componente principal de interfaz de búsqueda con disparadores, modal, filtrado, navegación por teclado y resultados agrupados.
- `src/features/search/components/GlobalSearch.test.tsx`: suite de 6 pruebas unitarias y de interacción que cubren apertura, atajos de teclado, agrupación, filtrado y selección con teclado.
- `src/app/shell/AppShell.tsx`: integración de `GlobalSearch` en la cabecera general de la aplicación.
- `src/styles/global.css`: estilos BEM para disparadores, modal flotante y full-screen móvil, pestañas de filtro, badges e ítems de búsqueda.
- `docs/00-project/implementation-plan.md`: tarea F3-02 marcada como completada.
- `docs/00-project/walkthrough-f3-02-search-ui.md`: documentación de cambios y decisiones técnicas.

## 4. Verificación

Las cinco comprobaciones obligatorias se ejecutaron en local con resultado satisfactorio:

1. `npm run typecheck`: 0 errores de TypeScript (`tsc -b`).
2. `npm run lint`: 0 advertencias y 0 errores de ESLint.
3. `npm test`: 24 archivos de prueba y 94 tests pasados con éxito.
4. `npm run build`: compilación limpia en 7.15s generando todos los bundles y activos estáticos.
5. `npm run check:links`: 114 archivos Markdown, 1016 enlaces relativos revisados, 0 problemas.

## 5. Pendiente

- Tarea F3-03: navegación interna del glosario con enlace directo desde los términos técnicos en las fichas de ejercicio.
