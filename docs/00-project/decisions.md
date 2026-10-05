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

## D-010 — Significado del símbolo

Fecha: 3 de octubre de 2026.

El escudo representa la protección y el bienestar del deportista. Las letras FJ
son las iniciales de FORJA.

No se atribuyen a la geometría otros significados. Las lecturas interpretativas
que aparecían en borradores del manual no forman parte de la marca.

## D-011 — Paleta cerrada

Fecha: 3 de octubre de 2026.

Se mantienen los tokens de `forja-tokens.css`. El azul secundario sigue siendo
`#1D5AD8`, con un contraste de 6,0:1 sobre blanco.

Del concepto visual inicial solo se incorpora `#E6F0FB` como `--forja-blue-light`,
para superficies. El ocre de advertencia recibe nombre propio, `--forja-ochre`, y
`--forja-warning` pasa a apuntar a él.

El resto de colores del concepto queda descartado.

## D-012 — Sin claim

Fecha: 3 de octubre de 2026.

FORJA no usa claim en la versión 1.0 de su marca. «Entrena · Aprende · Progresa»,
que solo aparecía en una imagen de concepto generada, queda descartado.

Donde haga falta acompañar a la marca con texto se usa el descriptor «Sistema de
conocimiento para el desarrollo físico de jóvenes deportistas».

## D-013 — Tamaños mínimos de la marca

Fecha: 3 de octubre de 2026.

| Uso | Mínimo |
|---|---|
| Símbolo en pantalla | 20 px de alto |
| Lockup en pantalla | 96 px de ancho |
| Símbolo en serigrafía o vinilo | 20 mm de alto |
| Símbolo bordado | 25 mm de alto |

El hueco más estrecho del símbolo mide el 11 % de su altura. Antes de la primera
producción de cada técnica se valida una muestra física. Si la muestra no
reproduce bien los huecos, se sube el mínimo y se registra el cambio.

## D-014 — Revisión de glifos de la iconografía

Fecha: 3 de octubre de 2026.

Se corrigen cinco conceptos del mapa de iconos que compartían glifo o usaban el
glifo de otro deporte:

| Concepto | Antes | Ahora | Motivo |
|---|---|---|---|
| Mancuerna (`dumbbell`) | `IconBarbell` | `ForjaDumbbellIcon` | Repetía el glifo de Fuerza. El `dumbbell` de Tabler dibuja una pesa rusa, así que se crea un icono propio: mancuerna en diagonal |
| Lanzamiento (`throw`) | `IconBallFootball` | `IconPlayHandball` | Figura que lanza, coherente con Velocidad (figura que corre) |
| Balón medicinal (`medicineBall`) | `IconBallBasketball` | `IconExerciseBall` | Balón neutro, sin deporte |
| Salto (`jump`) | `IconJumpRope` | `IconArrowBounce` | Trayectoria de despegue y aterrizaje en lugar de comba |
| RIR (`rir`) | `IconGaugeOff` | `IconBattery2` | Batería con reserva: las repeticiones que quedan |

Un test impide que dos conceptos vuelvan a compartir glifo.

## D-015 — Nivel H: hipótesis pendiente de validación

Fecha: 3 de octubre de 2026.

Se añade a los niveles de evidencia la categoría **H — Hipótesis pendiente de
validación**, que D-004 y `AGENTS.md` ya exigían distinguir pero que
[Niveles de evidencia en FORJA](../01-foundations/evidence-levels.md) no
recogía.

Los niveles quedan así: E (evidencia científica), C (consenso profesional),
M (decisión metodológica FORJA), H (hipótesis pendiente de validación) y
P (aplicación práctica).

Una hipótesis no se presenta como recomendación general. Cuando se valide pasa
a M, E o C; si no se confirma, se descarta, y el cambio se registra.

## D-016 — Guía técnica para agentes y flujo de módulos

Fecha: 4 de octubre de 2026.

[`AGENTS.md`](../../AGENTS.md) amplía su alcance: además de las reglas de
contenido, describe el stack, la arquitectura por funcionalidad de la
aplicación, las convenciones de nombres, el manejo de errores y la estrategia
de tests. Su objetivo es que cualquier herramienta o persona pueda trabajar en
un módulo sin desalinearse del repositorio.

Se adoptan además tres normas de trabajo nuevas:

- **Criterios mínimos de tests para módulos nuevos.** No se fija un umbral
  numérico de cobertura. Se exigen tests de la lógica de `domain/`, de la
  persistencia en el navegador, del flujo principal de cada página y de la
  integridad de los documentos que se lean desde `docs/`.
- **Construcción autocontenida.** Los módulos nuevos y las refactorizaciones
  amplias se desarrollan en su carpeta de funcionalidad y solo tocan fuera de
  ella los puntos de integración imprescindibles.
- **`walkthrough.md`.** Antes de cerrar un módulo se crea un `walkthrough.md`
  en la carpeta del módulo con el objetivo, las decisiones tomadas, los
  archivos modificados, la verificación y lo pendiente. Su resumen va también
  en la descripción de la pull request.

La revisión previa a la pull request comprueba el código contra la lista de
verificación de `AGENTS.md`.

## D-019 — Limpieza de binarios no referenciados en assets/ (DEC-F)

Fecha: 4 de octubre de 2026.

El repositorio acumulaba aproximadamente 13 MB de binarios redundantes y no
referenciados en la carpeta `assets/`, derivados de fases intermedias de
producción visual y paquetes comprimidos duplicados.

Se aprueba la eliminación de los siguientes binarios no referenciados:

1. **Paquete comprimido redundante de referencias**:
   - `assets/references/visual/ex-002/forja-visual-reference-ex002.zip` (5,8 MB):
     su contenido ya se encuentra descomprimido en `extracted/` para inspección.
   - `assets/references/visual/ex-002/source/` (1,5 MB): duplicado exacto del
     recurso en `extracted/`.
   - `assets/references/visual/ex-002/extracted/forja_visual_pack_ex002/references/` (1,5 MB):
     estilo infográfico de referencia no enlazado ni consumido.
   - Directorio vacío `assets/visual/`.

2. **Candidatos intermedios obsoletos en fichas de ejercicio**:
   - `assets/exercises/ex-005/source/*candidate*.png` (3,4 MB).
   - `assets/exercises/ex-006/source/*candidate*.png` (1,7 MB).
   - `assets/exercises/ex-007/source/*candidate*.png` (1,8 MB).
   Todos fueron sustituidos por los masters definitivos en WebP aprobados en QA
   humano (`assets/exercises/ex-0NN/master/ex-0NN-*-master.webp`).

3. **Criterio de preservación**:
   Se mantienen intactos todos los masters en WebP (`assets/exercises/*/master/`),
   los derivados web y miniaturas aprobados, los vectores oficiales de marca
   (`assets/brand/`) y las 3 referencias de concepto formalmente listadas en
   `assets/manifest.md` (`master-concept-v1.png`, `web-v1.png`,
   `forja-brand-and-session-concept-v1.png`).

