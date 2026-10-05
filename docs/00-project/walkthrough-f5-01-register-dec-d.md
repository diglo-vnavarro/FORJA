# Walkthrough — Tarea F5-01: Registro de la decisión DEC-D (D-021)

## Objetivo

Registrar formalmente en `docs/00-project/decisions.md` la decisión metodológica y técnica **DEC-D** (código **D-021**), que establece el marco de privacidad, gobernanza y gestión de datos de deportistas menores de edad para FORJA, como requisito normativo y arquitectónico previo a la implementación del módulo `athletes` (Fase 5) y del registro de evaluaciones asociadas (Fase 4, tarea F4-03).

## Decisiones tomadas

1. **Almacenamiento exclusivo en el cliente**:
   - FORJA no tiene backend ni servidor central ni envía telemetría. Toda persistencia se realiza localmente en el `localStorage` del navegador mediante esquemas versionados y validados con tipos canónicos.
2. **Minimización y seudonomización**:
   - Tratándose de personas menores de edad (marco RGPD / LOPDGDD), se excluyen datos identificativos innecesarios (sin DNI/NIE, sin dirección, sin contactos de tutores en la app). Identificador técnico local (`ATH-NNN` o UUID) y alias editable.
3. **Derechos de portabilidad y supresión total**:
   - Exportación completa en JSON estructurado y borrado total e irreversible bajo demanda del usuario.
4. **Separación estricta entre metodología y datos personales**:
   - La documentación metodológica (`docs/`) es estrictamente abstracta. Los casos personales anonimizados se reservan a `examples/`.

## Archivos modificados

- `docs/00-project/decisions.md`: Se añade la decisión **D-021 — Privacidad y gobernanza de datos de deportistas menores de edad (DEC-D)**.
- `src/test/decisions.test.ts`: Se añade test unitario que verifica la presencia e integridad de las cláusulas clave de D-021.
- `docs/00-project/implementation-plan.md`: Se marca la tarea F5-01 como **Hecha**.

## Verificación

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run check:links`
