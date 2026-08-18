# Activos visuales de EX-002

Este directorio prepara la integración de los tres niveles visuales de
EX-002 — Sentadilla goblet.

## Fuente metodológica

- [EX-002 — Sentadilla goblet](../../../docs/05-exercises/library/ex-002-goblet-squat.md)

La ficha EX es la fuente metodológica. Los activos visuales no pueden añadir
decisiones, prescripciones ni criterios que no estén respaldados por ella.

## Nivel 1 — Ilustración maestra

Representación maestra del ejercicio.

- **Estado:** aprobado para continuar la validación del sistema visual.
- **Nombre reservado:**
  `assets/exercises/ex-002/master/ex-002-goblet-squat-master.webp`.

## Nivel 2 — Infografía web

Representación explicativa para web o aplicación basada en el Nivel 1.

- **Estado:** candidato de producción incorporado; revisión visual humana
  pendiente.
- **Nombre reservado:**
  `assets/exercises/ex-002/web/ex-002-goblet-squat-web.webp`.

## Nivel 3 — Ficha rápida de sesión

Representación compacta para consulta durante la sesión.

- **Estado:** aprobado conceptualmente; asset definitivo pendiente de
  incorporar.
- **Nombre reservado:**
  `assets/exercises/ex-002/session/ex-002-goblet-squat-session.webp`.

Los activos de Nivel 1 y el candidato de Nivel 2 existen en sus rutas
reservadas. El archivo definitivo de Nivel 3 todavía no existe y no debe
sustituirse por un binario placeholder ni por una imagen reconstruida desde
Markdown o screenshots.

Las referencias visuales aprobadas se conservan separadamente en
[`assets/references/visual/ex-002/`](../../references/visual/ex-002/). Son
material de revisión, no activos de producción.

Permanece pendiente:

- revisar y aprobar la infografía candidata de Nivel 2;
- la ficha rápida definitiva de Nivel 3.

## Nivel 1 aprobado

El archivo
[`ex-002-goblet-squat-master.webp`](master/ex-002-goblet-squat-master.webp)
es una ilustración original generada específicamente para FORJA a partir del
brief aprobado. Utiliza fondo blanco editorial, incorpora el símbolo FJ
candidato en la manga y no contiene transparencia.

La revisión humana ha aprobado:

- agarre y posición de la mancuerna;
- manos, pies y apoyos;
- coherencia entre las dos fases;
- anatomía y edad visual del deportista;
- legibilidad al reducirlo;
- fidelidad al brief y ausencia de reglas técnicas añadidas.

## Revisión del candidato de Nivel 2

El candidato visual es
[`ex-002-goblet-squat-web.webp`](web/ex-002-goblet-squat-web.webp) y su fuente
editable es
[`ex-002-goblet-squat-web.html`](web/ex-002-goblet-squat-web.html).

Antes de promoverlo a `APPROVED` deben revisarse:

- jerarquía y lectura rápida;
- fidelidad del texto a la ficha EX-002;
- tamaño y utilidad de la ilustración;
- selección de competencia y criterios de modificación;
- representación no normativa de la variabilidad individual;
- legibilidad del aviso de ejemplo contextual no universal.

No se ha vectorizado automáticamente al deportista de las referencias.

El estado común se registra en el [manifest de activos](../../manifest.md).
