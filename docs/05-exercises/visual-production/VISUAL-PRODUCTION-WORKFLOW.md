# FORJA Visual Production Workflow

## Flujo oficial

```text
FICHA TÉCNICA
   ↓
VISUAL BRIEF
   ↓
PRODUCTION SPEC
   ↓
GENERACIÓN EXTERNA
   ↓
QA CHECKLIST
   ↓
APPROVED MASTER
   ↓
INTEGRACIÓN
   ↓
INFOGRAPHIC / SESSION CARD
```

## Responsabilidades

Codex no genera el master visual. Su función es preparar production specs, registrar estados, integrar únicamente archivos aprobados, actualizar `Exercise.media` mediante el manifiesto y validar rutas y archivos.

La generación se realiza externamente. La aprobación visual y técnica se realiza con `IMAGE-QA-CHECKLIST.md` antes de incorporar el archivo. EX-004 debe permanecer registrado como `FORJA ATHLETE MASTER`.

## Incorporación de un master

1. Conservar el original externo de máxima resolución en `assets/exercises/<id>/source/` cuando se entregue.
2. Guardar el master aprobado, sin sobrescribir el original, en `assets/exercises/<id>/master/`.
3. Usar `ex-<id>-<slug>-master.webp` según el manifiesto y el estándar.
4. Confirmar existencia, formato WebP, dimensiones, aspect ratio y naming.
5. Registrar la ruta y cambiar el estado a `approved` solo después de la aprobación humana.
6. Integrar el activo desde el manifiesto; páginas y componentes no deben contener rutas específicas.

## Cola pendiente

`READY_FOR_PRODUCTION` significa que existen ficha técnica y visual brief y no se conoce un bloqueo editorial crítico. Si `productionSpecStatus = missing`, el ejercicio está listo para preparar su production spec, pero todavía no está autorizado para generar el master.

`READY_FOR_MASTER_GENERATION` significa que la ficha, el brief y la production spec ya existen y que el ejercicio puede pasar al pipeline externo de generación y posterior QA. No implica que exista o esté aprobado un master.

La cola `READY_FOR_MASTER_GENERATION` contiene EX-003, EX-005, EX-006, EX-007, EX-008, EX-009, EX-010, EX-011, EX-012, EX-014 y EX-015.

## Thumbnails

No existe actualmente una utilidad ligera de thumbnails en el repositorio. No se añade una dependencia solo para producirlos. Mientras no exista un derivado aprobado, la aplicación puede reutilizar el master para la tarjeta sin declarar una ruta independiente. Un futuro derivado deberá mantener el aspect ratio, no recortar articulaciones, no alterar color y no añadir texto ni overlays.

## Branding

El único símbolo autorizado es `src/design-system/forja/brand/forja-symbol.svg`. Los logos aproximados o generados requieren `BRANDING_REVIEW_REQUIRED`; Codex no corrige su geometría ni regenera el master.
