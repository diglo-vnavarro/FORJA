# Prompt recomendado para Codex

Integra el sistema visual FORJA incluido en `src/design-system/forja`.

Antes de modificar código:
1. Lee `AGENTS.md`.
2. Lee `src/design-system/forja/docs/INTEGRATION.md`.
3. Lee `src/design-system/forja/src/icons/icon-map.json`.

Objetivo:
- convertir la iconografía de la aplicación a la capa semántica `ForjaIcon`;
- usar exclusivamente los logos canónicos de `brand/`;
- importar los tokens FORJA globalmente una sola vez;
- mantener el comportamiento y layout actuales;
- eliminar sustituciones visuales genéricas sólo cuando exista equivalencia aprobada;
- no redibujar ni generar ningún logo/icono;
- no hardcodear colores FORJA cuando exista token CSS.

Usa `<ForjaIcon name="...">` en componentes de negocio.
No importes iconos Tabler directamente fuera del design system.

Al terminar:
- ejecuta typecheck, lint y tests disponibles;
- lista los iconos migrados;
- lista cualquier concepto que no haya podido mapear;
- no alteres assets canónicos.
