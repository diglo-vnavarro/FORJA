# Manifest de activos visuales

Este manifest distingue masters candidatos, referencias visuales y archivos
de producción todavía pendientes.

Estados permitidos: `REFERENCE`, `DRAFT`, `MASTER`, `APPROVED` y `PENDING`.

| Asset | Tipo | Nivel | Estado | Ruta |
|---|---|---|---|---|
| FJ symbol | Marca | Master oficial v1 | APPROVED | `src/design-system/forja/brand/forja-symbol.svg` |
| FORJA wordmark | Marca | Master oficial v1 | APPROVED | `src/design-system/forja/brand/forja-wordmark.svg` |
| FJ + FORJA lockup | Marca | Master oficial v1 | APPROVED | `src/design-system/forja/brand/forja-lockup-horizontal.svg` |
| FORJA icon system | Iconografía | API semántica | APPROVED | `src/design-system/forja/src/icons/ForjaIcon.tsx` |
| EX-002 Level 1 reference | Referencia visual | Nivel 1 | REFERENCE | `assets/references/visual/ex-002/extracted/forja_visual_pack_ex002/exercises/ex-002/master/ex-002-goblet-squat-master-concept-v1.png` |
| EX-002 Level 2 reference | Referencia visual | Nivel 2 | REFERENCE | `assets/references/visual/ex-002/extracted/forja_visual_pack_ex002/exercises/ex-002/web/ex-002-goblet-squat-web-v1.png` |
| EX-002 Level 3 reference | Referencia visual | Nivel 3 | REFERENCE | `assets/references/visual/ex-002/extracted/forja_visual_pack_ex002/brand/prototypes/forja-brand-and-session-concept-v1.png` |
| EX-002 master | Ejercicio | Nivel 1 | APPROVED | `assets/exercises/ex-002/master/ex-002-goblet-squat-master.webp` |
| EX-002 web | Ejercicio | Nivel 2 | DRAFT | `assets/exercises/ex-002/web/ex-002-goblet-squat-web.webp` |
| EX-002 session | Ejercicio | Nivel 3 | PENDING | `assets/exercises/ex-002/session/ex-002-goblet-squat-session.webp` |
| Brand PNG derivatives | Marca | Derived | PENDING | `assets/brand/master/*.png` |

Los SVG de `assets/brand/master/` son copias de consumo estático de los masters
canónicos y deben permanecer idénticos a ellos.

Las referencias rasterizadas no se consumen como producción ni se incrustan
en los masters SVG.
