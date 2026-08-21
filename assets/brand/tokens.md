# Tokens de marca FORJA

La fuente canónica de estos valores es
`src/design-system/forja/src/styles/forja-tokens.css`. Los componentes deben
consumir las variables CSS y no repetir los valores hexadecimales.

| Token CSS | Valor v1 | Uso conceptual |
|---|---|---|
| `--forja-primary` | `#0B2A4A` | Identidad principal y fondos oscuros |
| `--forja-secondary` | `#1D5AD8` | Acentos y jerarquía secundaria |
| `--forja-gray-dark` | `#1F2937` | Texto oscuro |
| `--forja-gray-mid` | `#6B7780` | Información secundaria |
| `--forja-gray-light` | `#E5E7EB` | Fondos claros |
| `--forja-success` | `#16A34A` | Estados favorables |
| `--forja-danger` | `#DC2626` | Avisos y modificación de tarea |
| `--forja-warning` | `#986318` | Advertencias y revisión contextual |

Los SVG de marca e iconografía utilizan `currentColor` siempre que resulta
apropiado, por lo que estas variantes no requieren duplicar masters:

- dark-on-light;
- light-on-dark;
- monochrome.

La geometría permanece inmutable; el color se tematiza mediante estos tokens.
