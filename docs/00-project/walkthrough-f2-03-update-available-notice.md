# Walkthrough — F2-03: Aviso de Nueva Versión Disponible

## 1. Objetivo
- Qué resuelve:
  - Implementación del sistema y componente accesible de aviso de actualización (`UpdatePrompt`) para la PWA de FORJA según la decisión D-020 (DEC-C).
  - Notifica a la persona usuaria cuando una nueva versión de la aplicación ha sido descargada por el Service Worker y se encuentra en estado de espera (`waiting`).
  - La persona usuaria decide cuándo actualizar:
    * Botón «Actualizar ahora»: emite `SKIP_WAITING` y recarga la página limpiamente.
    * Botón «Más tarde»: descarta el aviso temporalmente, permitiendo continuar y finalizar borradores o sesiones en curso sin riesgo de pérdida de datos.
  - Componente integrado en `AppShell.tsx` con accesibilidad completa (`role="status"`, `aria-live="polite"`).
  - Pruebas unitarias en `src/app/shell/UpdatePrompt.test.tsx` (4 pruebas) y `src/app/shell/AppShell.test.tsx` (2 pruebas).
- Qué queda fuera:
  - La exportación/importación de datos en formato JSON (tarea F2-04).

## 2. Decisiones tomadas
- **Preservación incondicional de borradores activos**: El Service Worker nunca se reinicia silenciosamente; el aviso es visible pero no intrusivo, permitiendo al usuario posponer la recarga hasta guardar su trabajo.
- **Icono canónico del sistema de diseño**: Se utiliza el icono de semántica de refresco/ciclo (`endurance` / `IconRefresh`) disponible en `ForjaIcon`.

## 3. Archivos modificados y creados
- `src/app/pwa.ts`: Hook reactivo `usePwaUpdate` y sistema de eventos desacoplados para detección y aplicación de actualizaciones.
- `src/app/shell/UpdatePrompt.tsx`: Componente visual accesible del banner de actualización.
- `src/app/shell/UpdatePrompt.test.tsx`: Tests unitarios de interacción y accesibilidad del componente.
- `src/app/shell/AppShell.tsx`: Integración del banner `UpdatePrompt` en el layout principal.
- `src/app/shell/AppShell.test.tsx`: Tests de integración de navegación y del banner de actualización en el shell.
- `src/styles/global.css`: Estilos accesibles con tokens para `.update-prompt`.
- `public/sw.js`: Service worker con gestión del mensaje `SKIP_WAITING`.
- `docs/00-project/implementation-plan.md`: Marcado de la tarea F2-03 como completada.

## 4. Verificación
- `npm run typecheck`: OK (0 errores).
- `npm run lint`: OK (0 errores).
- `npm test`: OK (22 suites, 79 pruebas superadas).
- `npm run build`: OK (build de producción limpio).
- `npm run check:links`: OK (113 archivos Markdown, 1016 enlaces, 0 problemas).

## 5. Pendiente
- Abordar la tarea F2-04 (exportar e importar datos de `localStorage` en formato JSON).
