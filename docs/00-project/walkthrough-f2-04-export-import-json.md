# Walkthrough F2-04 — Exportar e importar borradores y ejecuciones en JSON

## Objetivo
Implementar la tarea F2-04 del plan: permitir la exportación e importación en formato JSON de las sesiones preparadas (borradores en `session-builder`) y los registros de ejecución en campo (`session-execution`), permitiendo salvar y restaurar datos de `localStorage` entre diferentes dispositivos o respaldarlos de manera segura y no destructiva.

## Decisiones tomadas
1. **Esquema de Respaldo Canónico (`ForjaBackupData`)**:
   - Estructura versionada con identificador de aplicación (`app: "FORJA"`, `version: 1`), fecha de exportación (`exportedAt`) y colecciones (`drafts`, `executions`).
   - Validador estricto `isForjaBackupData(value: unknown): value is ForjaBackupData` que comprueba cada elemento contra sus esquemas nativos (`isSessionDraft`, `isSessionExecution`).
2. **Estrategia de Combinación Segura (`mergeBackupData`)**:
   - En lugar de sobrescritura ciega y destructiva, los registros existentes se preservan y los duplicados por `id` se actualizan solo si la versión entrante tiene una fecha `updatedAt` más reciente.
3. **Manejo de Errores Desacoplado**:
   - El *parser* devuelve `{ success: boolean, data?, error? }` en lugar de lanzar excepciones que rompan la UI.
   - Mensajes accesibles mediante `role="status"` y `aria-live="polite"` que informan detalladamente a la persona usuaria sobre el número de borradores y ejecuciones procesados o si ocurrió un error en el archivo cargado.
4. **Descarga en Cliente**:
   - Generación de Blob `application/json` y disparo de enlace transitorio con nombre parametrizado `forja-backup-<timestamp>.json`.

## Archivos modificados y creados
- `src/features/session-builder/domain/sessionBackup.ts`: Modelo de datos de respaldo, validador de esquema, parser resiliente y algoritmo de combinación.
- `src/features/session-builder/domain/sessionBackup.test.ts`: 8 pruebas unitarias cubriendo validación, creación, parseo y combinación.
- `src/features/session-builder/data/sessionBackupStorage.ts`: Persistencia y recuperación en `localStorage` y descarga de archivo JSON en cliente.
- `src/features/session-builder/data/sessionBackupStorage.test.ts`: 3 pruebas unitarias de persistencia y descarga en el DOM simulado.
- `src/features/session-builder/pages/SavedSessionsPage.tsx`: Integración de acciones «Exportar JSON» e «Importar JSON» con avisos accesibles de estado.
- `src/features/session-builder/pages/SavedSessionsPage.test.tsx`: Pruebas de integración de exportación e importación de archivos.
- `src/styles/global.css`: Estilos para botones secundarios, contenedor de acciones y avisos de estado.
- `docs/00-project/implementation-plan.md`: Marcada la tarea F2-04 como completada.

## Verificación
1. `npm run typecheck`: OK (0 errores).
2. `npm run lint`: OK (0 errores).
3. `npm test`: OK (22 suites, 86 pruebas pasadas).
4. `npm run build`: OK (build de producción completado con éxito).
5. `npm run check:links`: OK (113 archivos Markdown, 1016 enlaces, 0 problemas).

## Pendiente
- La Fase 2 (Uso sin conexión / PWA) queda completada al 100%. Continuar con la Fase 3 (Búsqueda global unificada).
