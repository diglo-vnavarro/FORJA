# Walkthrough — F1-07 / DEC-B: Tema Oscuro y Contraste Accesible

## 1. Objetivo
- Qué resuelve:
  - Implementación completa del modo oscuro bajo la decisión arquitectónica formal DEC-B (registrada como D-018 en `decisions.md`).
  - Tokens semánticos contextuales con soporte de `data-theme="dark"` y `@media (prefers-color-scheme: dark)`.
  - Garantía matemática estricta de contraste accesible WCAG 2.1 nivel AA (mínimo 4.5:1 para texto y 3.0:1 para elementos de interfaz).
  - Persistencia en almacenamiento local versionado (`forja.theme.v1`) con validador `isTheme` y valor por defecto `'system'`.
  - Iconos semánticos oficiales `themeLight` y `themeDark` integrados en el mapa cerrado de `ForjaIcon`.
  - Conmutador accesible de tema integrado en la barra de aplicación (`AppShell`) con roles y etiquetas aria descriptivas.
- Qué queda fuera:
  - Temas personalizados con esquemas de color arbitrarios (la identidad de FORJA es cerrada según D-011).

## 2. Decisiones tomadas
- **D-018 (DEC-B)**: Paleta de modo oscuro basada en navy ultra-oscuro de identidad (`#0B111E` fondo de página, `#131E31` superficies de tarjeta, `#1B2A43` contenedores sutiles, `#F1F5F9` texto principal, `#94A3B8` texto secundario, `#3B82F6` acento interactivo).
- **Iconos oficiales**: Se añadieron `themeLight` (IconSun) y `themeDark` (IconMoon) de Tabler exclusivamente dentro del sistema de diseño FORJA (`ForjaIcon.tsx` y `icon-map.json`), cumpliendo con la regla de aislamiento del sistema visual.
- **Sincronización inicial sin parpadeo**: `applyThemeToDocument(loadTheme())` se ejecuta de forma síncrona en `main.tsx` antes del montaje del árbol de React para evitar *flash of unstyled content* (FOUC).

## 3. Archivos modificados y creados
- `docs/00-project/decisions.md`: Registro de la decisión D-018 (DEC-B).
- `docs/00-project/implementation-plan.md`: Marcado de la tarea F1-07 como completada.
- `src/design-system/forja/src/icons/ForjaIcon.tsx`: Incorporación de `themeLight` y `themeDark`.
- `src/design-system/forja/src/icons/icon-map.json`: Registro en el manifiesto oficial de iconos de FORJA.
- `src/design-system/forja/src/styles/forja-tokens.css`: Definición de tokens para `data-theme="dark"` y `prefers-color-scheme: dark`.
- `src/design-system/forja/src/styles/themeContrast.test.ts`: Pruebas de contraste según la fórmula WCAG 2.1 (AA).
- `src/app/theme.ts`: Módulo de dominio, almacenamiento versionado y hook `useTheme`.
- `src/app/theme.test.ts`: Pruebas unitarias de validación, almacenamiento, resolución efectiva y manipulación del DOM.
- `src/app/shell/AppShell.tsx`: Botón conmutador accesible de tema.
- `src/app/shell/AppShell.test.tsx`: Pruebas de renderizado y conmutación interactiva de tema en el shell.
- `src/styles/global.css`: Ajustes y estilos de alto contraste para el modo oscuro y botón conmutador.
- `src/main.tsx`: Inicialización temprana del tema persistido.

## 4. Verificación
- `npm run typecheck`: 0 errores.
- `npm run lint`: 0 errores, 0 advertencias.
- `npm test`: 23 suites y 96 pruebas superadas (100% de éxito).
- `npm run build`: Compilación Vite en producción limpia y exitosa.
- `npm run check:links`: 113 archivos Markdown revisados, 1016 enlaces, 0 problemas.

## 5. Pendiente
- Nada pendiente para esta tarea; el modo oscuro queda plenamente integrado y probado.
