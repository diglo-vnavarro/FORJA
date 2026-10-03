# Manual de marca FORJA

Estado: **borrador v0.2, pendiente de revisión**. Las decisiones tomadas están
registradas en [`docs/00-project/decisions.md`](../../../docs/00-project/decisions.md)
(D-006 a D-009). Las demás son recomendaciones y no se aplican hasta que se
aprueben.

Manual completo: [`FORJA_Manual_de_Marca_v0.2.pdf`](FORJA_Manual_de_Marca_v0.2.pdf)
(18 páginas, A4 apaisado).

## Contenido

| Sección | Qué recoge |
|---|---|
| Resumen | Estado de cada pieza: símbolo, wordmark, lockup, paleta, iconografía y tipografía |
| 01 · La idea | Lo que dice el repositorio y una lectura del símbolo pendiente de validar |
| 02 · Construcción | Medidas del símbolo sobre su `viewBox` 109 × 131; el módulo es el asta de la F (21) |
| 03 · Wordmark y lockup | Proporciones y comparación entre wordmark v1 y v2 |
| 04 · Versiones | Navy sobre claro, blanco sobre navy, monocroma, símbolo y wordmark |
| 05 · Color | Tokens de `forja-tokens.css` con contraste WCAG y comparación con el concepto inicial |
| 06 · Espacio y tamaño | Área de respeto y tamaños mínimos provisionales |
| 07 · Tipografía | Inter (D-006): pesos, cifras tabulares y jerarquía |
| 08 · Iconografía | Los 40 conceptos de `icon-map.json` y los que conviene revisar |
| 09 · Ilustración | Reglas del FORJA ATHLETE MASTER |
| 10 · Aplicaciones | Ficha web y tarjeta de sesión de EX-002; ropa |
| 11 · Voz | Reglas editoriales con ejemplos |
| 12 · Uso incorrecto | Ocho usos prohibidos |
| 13 · Kit | Piezas del kit y dónde está cada una |
| Decisiones | D1–D8: cuatro resueltas y cuatro con recomendación |

## Decisiones

| | Decisión | Estado |
|---|---|---|
| D1 | Lectura del símbolo | Recomendación: escudo = protección y bienestar del deportista; FJ = iniciales. Nada más. |
| D2 | Paleta definitiva | Recomendación: mantener los tokens, añadir `--forja-blue-light: #E6F0FB` y nombrar el ocre `--forja-ochre`. |
| D3 | Claim | Recomendación: ninguno en v1.0. Usar el descriptor «Sistema de conocimiento para el desarrollo físico de jóvenes deportistas». |
| D4 | Tipografía | Resuelta: Inter ([D-006](../../../docs/00-project/decisions.md)). |
| D5 | Wordmark | Resuelta: revectorizado ([D-007](../../../docs/00-project/decisions.md)). |
| D6 | Color del logotipo en la app | Resuelta: SVG en línea y lockup ajustado ([D-008](../../../docs/00-project/decisions.md)). |
| D7 | Kit mínimo | Resuelta ([D-009](../../../docs/00-project/decisions.md), [`../kit/`](../kit/README.md)). |
| D8 | Tamaños mínimos y ropa | Recomendación: 20 px y 96 px en pantalla; 20 mm en serigrafía o vinilo y 25 mm en bordado, a confirmar con muestras. |

## Pendiente de revisar fuera de las ocho decisiones

En el mapa de iconos, Mancuerna y Fuerza comparten glifo. Además, Lanzamiento
usa un balón de fútbol, Balón medicinal uno de baloncesto, Salto una comba y RIR
un indicador «apagado».

## Cómo se regenera

```bash
node assets/brand/manual/manual-pdf.cjs
```

Requisitos:

- `npm install`, para tener los iconos de Tabler y la fuente Inter;
- Playwright con Chromium. Si no está en `node_modules`, se indica su ruta con
  `PLAYWRIGHT_PATH=/ruta/a/node_modules/playwright`;
- Git, para mostrar la comparación con el wordmark v1. Sin Git, la página
  muestra solo la v2.

Con `FORJA_MANUAL_PNG=<carpeta>` exporta además una imagen por página.
