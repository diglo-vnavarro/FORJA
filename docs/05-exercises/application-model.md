# Modelo de ejercicios en la aplicación

## Propósito

La aplicación consume las fichas de `docs/05-exercises/library/` como fuente
documental. La capa TypeScript no sustituye esas fichas: aporta identidad
estable, taxonomías, estados de producción y una estructura navegable.

## Composición de `Exercise`

- `identity`: ID, slug, nombre visible, aliases, descripción, objetivo y estado
  del contenido.
- `classification`: patrón principal, patrones secundarios, capacidades y
  atributos documentales.
- `context`: equipamiento, entorno, espacio, superficie y requisitos.
- `media`: estado general y estado individual de master, thumbnail,
  infografía, ficha de sesión y brief visual.
- `prescription`: variables aplicables y ejemplo contextual. Una variable no
  contiene un valor normativo salvo que la fuente lo establezca expresamente.
- `coaching`: preparación, ejecución, consignas, competencia observable,
  errores, variabilidad aceptable y criterios de parada.
- `decision`: motivos documentados para elegir o evitar la tarea.
- `relations`: regresiones, progresiones, sustituciones, variantes y ejercicios
  relacionados.
- `safety`: requisitos, advertencias y criterios de parada.
- `whatToRecord`: información que puede resultar útil registrar.
- `traceability`: ficha fuente y notas metodológicas o de evidencia.

## Prescripción

Las variables se componen mediante dos familias:

- `standard`: series, repeticiones, tiempo, distancia, carga, recuperación,
  RPE, RIR, rango, tempo, intención y calidad;
- `specific`: variables propias de determinadas tareas, como asistencia,
  altura, apoyo, lado, densidad, feedback, resistencia de banda o palanca.

El ejemplo contextual se conserva separado de las variables. Un ejemplo como
`2–3 × 6–8` no se transforma en una recomendación universal.

## Estados

`contentStatus` describe la madurez técnica:

- `conceptual`: existe en el índice, pero no tiene ficha utilizable;
- `draft`: ficha todavía no utilizable;
- `usable`: ficha técnica utilizable.

`media.status` describe la producción visual de forma independiente:

- `missing`: no existe producción visual;
- `partial`: existe solo parte de los niveles previstos;
- `complete`: están disponibles todos los niveles requeridos.

Cada activo conserva además su estado individual. La ausencia de imagen no
convierte una ficha técnica utilizable en borrador.

## Añadir un ejercicio

1. Crear o revisar su ficha documental siguiendo `exercise-card-standard.md`.
2. Añadir los conceptos compartidos a las taxonomías solo si todavía no
   existen y sin forzarlos a un icono incorrecto.
3. Registrar identidad, clasificación, equipamiento y variables aplicables en
   `data/exercises.ts`.
4. Importar la ficha como fuente en `data/exerciseDocuments.ts`.
5. Declarar únicamente los activos que existan físicamente.
6. Registrar relaciones solo cuando la ficha las documente.
7. Ejecutar typecheck, lint, tests y build.

EX-016–EX-025 permanecen en `exerciseIndex.ts` con estado `conceptual` y no se
incluyen en el catálogo utilizable.
