# Decisiones iniciales

## D-001 — GitHub como fuente oficial

La documentación aceptada de FORJA se conservará en este repositorio.

Las conversaciones y borradores externos no constituyen documentación oficial.

## D-002 — Markdown como formato principal

La documentación se escribirá en Markdown para facilitar el versionado, las revisiones y su posterior publicación en diferentes formatos.

## D-003 — Separación entre metodología y casos prácticos

La metodología general se mantendrá separada de las aplicaciones personales.

`Proyecto Iker` será el primer caso práctico, pero no condicionará la reutilización del sistema.

## D-004 — Separación entre evidencia y decisiones metodológicas

FORJA distinguirá claramente entre conocimiento científico, consenso profesional, decisiones metodológicas e hipótesis.

## D-005 — Desarrollo antes que rendimiento inmediato

El bienestar, la continuidad deportiva y el desarrollo a largo plazo prevalecerán sobre los resultados competitivos inmediatos.

## D-006 — Inter como tipografía de la aplicación y de las fichas

Fecha: 3 de octubre de 2026.

La aplicación y las piezas generadas desde ella (fichas, tarjetas de sesión, manual
y kit de marca) usan Inter, en su versión variable, como única familia tipográfica.

- Se sirve desde el propio proyecto (`@fontsource-variable/inter`) y no desde un
  servicio externo, para no depender de terceros ni transferir datos de los
  usuarios.
- El token `--forja-font-sans` de `forja-tokens.css` define la pila tipográfica.
- Motivos: licencia libre (SIL OFL), buena lectura en tamaños pequeños, cifras
  tabulares disponibles para series, repeticiones y tiempos, cobertura completa
  del español y coincidencia con la fuente que el código ya declaraba.
- El wordmark no depende de esta fuente: es un trazado.

## D-007 — Revectorización del wordmark

Fecha: 3 de octubre de 2026.

El wordmark v1 procedía de una vectorización de imagen, con contornos escalonados
de 1 unidad. Se sustituye por una versión v2 con la misma geometría, formada por
rectas y curvas Bézier.

- Desviación máxima respecto a v1: 1 unidad del `viewBox` 1502 × 271 (0,4 % de
  la altura de las mayúsculas).
- Se conservan el `viewBox`, las proporciones, el espaciado y `currentColor`.
- El procedimiento es reproducible:
  [`assets/brand/tools/revectorizar-wordmark.py`](../../assets/brand/tools/revectorizar-wordmark.py).
- Esta decisión es la autorización explícita que exigen las reglas del sistema
  visual para modificar un master. Cualquier cambio posterior de la geometría
  necesitará una decisión nueva.

## D-008 — Logotipo en la aplicación y caja del lockup

Fecha: 3 de octubre de 2026.

- `ForjaLogo` incrusta los masters SVG en línea para que `currentColor` herede
  los tokens: navy (`--forja-primary`) sobre claro y blanco (`--forja-white`) en
  la versión inversa. Se retira el filtro `invert()`.
- El `viewBox` del lockup horizontal pasa de `0 0 980 180` a `0 12 868 144` y se
  ajusta a su contenido. La posición relativa del símbolo y el wordmark no cambia.

## D-009 — Kit mínimo de marca

Fecha: 3 de octubre de 2026.

Se generan desde los masters, sin redibujar, con
[`assets/brand/kit/generar-kit.cjs`](../../assets/brand/kit/generar-kit.cjs):

- favicon SVG (navy en pestaña clara, blanco en oscura) y PNG de 32 px;
- icono de Apple (180 px), iconos de aplicación (192 y 512 px), icono
  *maskable* (512 px) y manifiesto web;
- imagen para compartir de 1200 × 630, con el lockup y el descriptor de la
  visión, sin claim;
- PNG transparentes de símbolo, wordmark y lockup en navy, blanco y negro, y
  avatar de 800 px.
