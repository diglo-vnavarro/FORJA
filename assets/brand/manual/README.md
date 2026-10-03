# Manual de marca FORJA

Estado: **v1.0, aprobado** el 3 de octubre de 2026.

Manual completo: [`FORJA_Manual_de_Marca_v1.0.pdf`](FORJA_Manual_de_Marca_v1.0.pdf)
(18 páginas, A4 apaisado).

## Contenido

| Sección | Qué recoge |
|---|---|
| Resumen | Estado de cada pieza: símbolo, wordmark, lockup, paleta, iconografía y tipografía |
| 01 · La idea | Significado del símbolo y reglas de uso |
| 02 · Construcción | Medidas del símbolo sobre su `viewBox` 109 × 131; el módulo es el asta de la F (21) |
| 03 · Wordmark y lockup | Proporciones y comparación entre wordmark v1 y v2 |
| 04 · Versiones | Navy sobre claro, blanco sobre navy, monocroma, símbolo y wordmark |
| 05 · Color | Paleta cerrada con contraste WCAG y reglas de color |
| 06 · Espacio y tamaño | Área de respeto y tamaños mínimos |
| 07 · Tipografía | Inter (D-006): pesos, cifras tabulares y jerarquía |
| 08 · Iconografía | Los 40 conceptos de `icon-map.json` y los que conviene revisar |
| 09 · Ilustración | Reglas del FORJA ATHLETE MASTER |
| 10 · Aplicaciones | Ficha web y tarjeta de sesión de EX-002; ropa |
| 11 · Voz | Reglas editoriales con ejemplos |
| 12 · Uso incorrecto | Ocho usos prohibidos |
| 13 · Kit | Piezas del kit y dónde está cada una |
| Decisiones | D1–D8, todas registradas |

## Decisiones

| | Decisión | Registro |
|---|---|---|
| D1 | Significado del símbolo: escudo = protección y bienestar del deportista; FJ = iniciales | D-010 |
| D2 | Paleta cerrada: tokens actuales + `--forja-blue-light` y `--forja-ochre` | D-011 |
| D3 | Sin claim; descriptor «Sistema de conocimiento para el desarrollo físico de jóvenes deportistas» | D-012 |
| D4 | Tipografía Inter | D-006 |
| D5 | Wordmark v2 | D-007 |
| D6 | Logotipo en línea y lockup ajustado | D-008 |
| D7 | Kit mínimo ([`../kit/`](../kit/README.md)) | D-009 |
| D8 | Tamaños mínimos: 20 px, 96 px, 20 mm (serigrafía o vinilo) y 25 mm (bordado) | D-013 |

Todas están en [`docs/00-project/decisions.md`](../../../docs/00-project/decisions.md).
Cambiar cualquiera exige una decisión nueva y una nueva versión del manual.

## Pendiente fuera del manual

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
