# Tokens de marca FORJA

La fuente canónica de estos valores es
`src/design-system/forja/src/styles/forja-tokens.css`. Los componentes deben
consumir las variables CSS y no repetir los valores hexadecimales.

| Token CSS | Valor | Uso conceptual |
|---|---|---|
| `--forja-primary` | `#0B2A4A` | Identidad principal y fondos oscuros |
| `--forja-secondary` | `#1D5AD8` | Acentos y jerarquía secundaria |
| `--forja-blue-light` | `#E6F0FB` | Superficies azul claro (fondos de bloque, resaltes) |
| `--forja-gray-dark` | `#1F2937` | Texto oscuro |
| `--forja-gray-mid` | `#6B7780` | Información secundaria |
| `--forja-gray-light` | `#E5E7EB` | Fondos claros |
| `--forja-success` | `#16A34A` | Estados favorables |
| `--forja-danger` | `#DC2626` | Avisos y modificación de tarea |
| `--forja-warning` | `#986318` (`--forja-ochre`) | Advertencias y revisión contextual |

La paleta queda cerrada en la v1.0 del manual de marca
([D-011](../../docs/00-project/decisions.md)). Los colores del concepto visual
inicial que no figuran en esta tabla quedan descartados.

Los SVG de marca e iconografía utilizan `currentColor` siempre que resulta
apropiado, por lo que estas variantes no requieren duplicar masters:

- dark-on-light;
- light-on-dark;
- monochrome.

La geometría permanece inmutable; el color se tematiza mediante estos tokens.
