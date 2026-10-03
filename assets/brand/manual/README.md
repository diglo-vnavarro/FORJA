# Manual de marca FORJA

Estado: **borrador v0.1, pendiente de revisión**. Ninguna decisión de este
manual está aprobada hasta que se registre en
[`docs/00-project/decisions.md`](../../../docs/00-project/decisions.md).

Manual completo: [`FORJA_Manual_de_Marca_v0.1.pdf`](FORJA_Manual_de_Marca_v0.1.pdf)
(18 páginas, A4 apaisado).

El manual recopila la identidad tal como existe en el repositorio. No cambia la
geometría de ningún master.

## Contenido

| Sección | Qué recoge |
|---|---|
| Resumen | Estado de cada pieza: símbolo, wordmark, lockup, paleta, iconografía y tipografía |
| 01 · La idea | Lo que dice el repositorio y una lectura del símbolo, pendiente de validar |
| 02 · Construcción | Medidas del símbolo sobre su `viewBox` 109 × 131; módulo = asta de la F (21) |
| 03 · Wordmark y lockup | Proporciones y avisos sobre el trazado y el `viewBox` |
| 04 · Versiones | Navy sobre claro, blanco sobre navy, monocroma, símbolo y wordmark |
| 05 · Color | Tokens de `forja-tokens.css` con contraste WCAG y comparación con el concepto inicial |
| 06 · Espacio y tamaño | Área de respeto y tamaños mínimos provisionales |
| 07 · Tipografía | Estado actual (sin fuente de marca) y jerarquía observada en la app |
| 08 · Iconografía | Los 40 conceptos de `icon-map.json` y los que conviene revisar |
| 09 · Ilustración | Reglas del FORJA ATHLETE MASTER |
| 10 · Aplicaciones | Ficha web y tarjeta de sesión de EX-002; ropa |
| 11 · Voz | Reglas editoriales con ejemplos |
| 12 · Uso incorrecto | Ocho usos prohibidos |
| 13 · Kit | Qué existe, qué hay que corregir y qué falta |
| Decisiones a confirmar | D1–D8 |

## Hallazgos que requieren decisión

1. **Wordmark escalonado.** `forja-wordmark.svg` está vectorizado desde una
   imagen, con segmentos de 1 unidad. No se nota en pantalla, pero sí en
   impresión grande o bordado.
2. **El `viewBox` del lockup deja un 12 % de aire a la derecha.** El contenido
   termina en x = 865 de 980.
3. **El logotipo sale negro en la app.** `ForjaLogo` usa `<img>`, así que
   `currentColor` no hereda el navy. La versión inversa usa `filter: invert(1)`.
4. **Hay dos paletas.** El concepto inicial usa `#1F5A9D`, `#E6F0FB`,
   `#1A1F26` y `#F2F4F7`; los tokens usan `#1D5AD8`, `#1F2937` y `#E5E7EB`.
5. **Claim sin adoptar.** «Entrena · Aprende · Progresa» solo aparece en el
   concepto generado.
6. **No hay tipografía de marca.** La app pide Inter, pero no la carga.
7. **Falta el kit mínimo.** No hay favicon, iconos de app, PNG transparentes ni
   `og:image`.
8. **Iconos semánticos dudosos.** Mancuerna y Fuerza comparten glifo. Para
   lanzamiento hay un balón de fútbol, para balón medicinal uno de baloncesto,
   para salto una comba y para RIR un indicador «apagado».

## Cómo se regenera

```bash
node assets/brand/manual/manual-pdf.cjs
```

Requisitos:

- `npm install`, para tener los SVG de `@tabler/icons`;
- Playwright con Chromium. Si no está en `node_modules`, se indica su ruta con
  `PLAYWRIGHT_PATH=/ruta/a/node_modules/playwright`.

El generador lee los masters de `src/design-system/forja/brand/`, los tokens de
`forja-tokens.css` y el mapa de iconos. Si cambian, el manual cambia con ellos.
Con `FORJA_MANUAL_PNG=<carpeta>` exporta además una imagen por página.
