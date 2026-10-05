# Walkthrough — F0-05: Normas Editoriales de FORJA

## 1. Objetivo
- Qué resuelve:
  - Creación del documento canónico oficial de normas editoriales y de contenido en `docs/01-foundations/editorial-standards.md`, cerrando la tarea pendiente de la Fase 0 de la hoja de ruta.
  - Centralización de las reglas de contenido, lenguaje, rigor científico, terminología, niveles de evidencia y criterios de aceptación que estaban dispersas entre `AGENTS.md` y `CONTRIBUTING.md`.
  - Vinculación cruzada limpia sin duplicación desde `AGENTS.md`, `CONTRIBUTING.md` y `docs/00-project/roadmap.md`.
- Qué queda fuera:
  - Contenido metodológico o prescripción de ejercicios nuevos.

## 2. Decisiones tomadas
- **Unificación canónica**: Se establece `docs/01-foundations/editorial-standards.md` como el único documento de referencia para todas las personas y agentes que escriban o editen documentación en FORJA.
- **Sin duplicación**: `AGENTS.md` y `CONTRIBUTING.md` delegan en este documento para el marco normativo completo, reteniendo únicamente listas resumidas o pautas operativas directas.

## 3. Archivos modificados y creados
- `docs/01-foundations/editorial-standards.md`: Documento oficial de normas editoriales y de contenido.
- `docs/00-project/roadmap.md`: Actualización del enlace canónico de normas editoriales.
- `docs/00-project/implementation-plan.md`: Marcado de la tarea F0-05 como completada.
- `AGENTS.md`: Enlace de referencia a `editorial-standards.md`.
- `CONTRIBUTING.md`: Enlace de referencia a `editorial-standards.md`.

## 4. Verificación
- `npm run typecheck`: OK (0 errores).
- `npm run lint`: OK (0 errores).
- `npm test`: OK (20 suites, 73 pruebas superadas).
- `npm run build`: OK (build de producción limpio).
- `npm run check:links`: OK (114 archivos Markdown, 1022 enlaces, 0 problemas).

## 5. Pendiente
- Nada pendiente para F0-05.
