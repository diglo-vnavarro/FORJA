# Plan de implementación

Fecha: 4 de octubre de 2026.

Estado: propuesta pendiente de aprobación.

Este documento reúne el trabajo pendiente de FORJA y lo ordena en fases
ejecutables. Está pensado para que una persona o un agente pueda retomar el
desarrollo sin depender de conversaciones anteriores.

Complementa la [hoja de ruta](roadmap.md), que describe el estado del
contenido, y se rige por [`AGENTS.md`](../../AGENTS.md). Si este plan
contradice alguno de los dos, prevalecen ellos.

## Cómo usar este plan

- Cada tarea tiene un identificador (`F1-03`) y se implementa en **una rama y
  una pull request en borrador** propias.
- Los módulos nuevos y las refactorizaciones amplias siguen el flujo de
  [`AGENTS.md`](../../AGENTS.md#flujo-de-trabajo-para-módulos-y-refactorizaciones):
  construcción autocontenida, `walkthrough.md` y lista de verificación previa
  a la pull request.
- Una tarea marcada con **Decisión** no se empieza hasta que la decisión esté
  registrada en [decisions.md](decisions.md).
- Una tarea marcada con **Contenido** depende de documentos de `docs/` que
  redacta y revisa una persona. Los agentes pueden preparar la estructura, pero
  no deciden la metodología.
- Al cerrar una tarea se marca como hecha aquí, en la misma pull request.

## Punto de partida

Estado verificado en el código el 4 de octubre de 2026:

| Ámbito | Estado |
| --- | --- |
| Ejercicios | Catálogo con búsqueda y filtros, detalle completo, 15 fichas leídas desde Markdown. |
| Sesiones | Catálogo y detalle de SES-001 a SES-003, leídos desde Markdown. |
| Constructor | Borradores en `localStorage`, guardados y reabribles. |
| Ejecución | Registro de tareas (hecha, modificada, omitida, parada) en `localStorage`. |
| Programación, Atletas, Biblioteca | Rutas con `ComingSoonPage`. |
| Calidad | CI con tipos, lint, tests, compilación y enlaces. |
| Responsive | Sin desbordamiento horizontal a 375 px, pero páginas muy largas: el detalle de un ejercicio ocupa unas 12 pantallas y el catálogo unas 11. |
| PWA | Existe `manifest.webmanifest`; no hay *service worker* ni funcionamiento sin conexión. |

## Decisiones que necesita el proyecto

Antes de las fases afectadas hay que registrar estas decisiones. Ninguna la
toma un agente.

| ID | Decisión | Bloquea |
| --- | --- | --- |
| DEC-A | Dirección de UX: patrón de navegación, modelo *mobile-first* y prioridades por pantalla (D-017). | **Registrada.** |
| DEC-B | Modo oscuro. La paleta es cerrada (D-011); un tema oscuro necesita tokens nuevos y aprobación. | F1-07 |
| DEC-C | Funcionamiento sin conexión: qué se guarda en caché y cómo se avisa de una versión nueva del contenido. | F2 |
| DEC-D | Datos de deportistas: qué se guarda, dónde (solo en el dispositivo o con servidor), cómo se exporta y borra, y base legal tratándose de menores. | F5 |
| DEC-E | Alcance del «motor de generación y adaptación de sesiones» de la hoja de ruta, frente al principio de que FORJA no genera entrenamientos automáticamente. | F7 |
| DEC-F | Limpieza de unos 13 MB de binarios no referenciados en `assets/`. | F0-06 |
| DEC-G | Protección de la rama `main` en GitHub (la configura la persona responsable del repositorio). | — |

## Fase 0 — Correcciones e higiene

Objetivo: dejar la base sin errores conocidos antes de rediseñar. Tareas
pequeñas e independientes.

| ID | Tarea | Criterio de aceptación |
| --- | --- | --- |
| F0-01 | Unificar «Entrenamientos» (tarjeta del Dashboard) y «Sesiones» (navegación). | **Hecha.** Un solo término en toda la interfaz, coherente con el glosario. |
| F0-02 | Las listas dentro de la descripción de un ejercicio se muestran aplanadas («mancuerna; - kettlebell»). Corregir en `documentAdapter.ts`. | **Hecha.** La descripción de EX-002 se muestra sin guiones sueltos; test que lo cubra. |
| F0-03 | El catálogo de ejercicios muestra «15 fichas» como texto fijo. | **Hecha.** El número sale de los datos; test que lo cubra. |
| F0-04 | El perfil de la barra superior muestra unas iniciales fijas. | **Hecha.** Sustituir por un marcador neutro hasta que exista el módulo de perfil. |
| F0-05 | Normas editoriales sin documento propio (hoja de ruta, Fase 0). | **Contenido.** Documento en `docs/01-foundations/` que reúna las reglas hoy repartidas entre `AGENTS.md` y `CONTRIBUTING.md`, sin duplicarlas. ✅ Hecha en rama docs/f0-05-editorial-standards. |
| F0-06 | Binarios no referenciados en `assets/`. | **Decisión DEC-F.** Inventario de archivos sin referencias y eliminación de los aprobados. ✅ Hecha en rama fix/f0-06-cleanup-unreferenced-binaries-dec-f. |

## Fase 1 — Rediseño de la experiencia de uso

Objetivo: una interfaz *mobile-first*, completamente responsive, pensada para
el uso real de FORJA: preparar en el escritorio y consultar o registrar en el
campo, con el teléfono en la mano.

### Criterios de diseño propuestos

Son una propuesta para DEC-A, no decisiones adoptadas.

1. **Mobile-first.** Se diseña primero a 360–390 px y se amplía. El campo de
   entrenamiento es el contexto más exigente: luz exterior, una mano y poco
   tiempo.
2. **Navegación adaptativa.** Barra inferior con 4–5 destinos en el teléfono,
   barra lateral compacta en tableta y barra lateral completa en escritorio.
   Es el patrón habitual de las aplicaciones móviles actuales y deja la
   navegación al alcance del pulgar.
3. **Revelación progresiva.** El detalle de un ejercicio o de una sesión
   muestra primero lo necesario para decidir (objetivo, dosis, calidad,
   criterios de parada) y el resto en secciones plegables o pestañas. Reduce
   las páginas de 9–12 pantallas.
4. **Modo campo.** La ejecución de una sesión muestra una tarea por pantalla,
   con controles grandes (mínimo 44 × 44 px), alto contraste y registro en uno
   o dos toques.
5. **Búsqueda global** accesible desde cualquier pantalla (ver Fase 3).
6. **Componentes basados en el contenedor.** *Container queries* de CSS para
   que una tarjeta se adapte al espacio que ocupa y no solo al ancho de la
   pantalla.
7. **Transiciones discretas** con la API *View Transitions* donde el navegador
   la admita, respetando `prefers-reduced-motion`.
8. **Accesibilidad WCAG 2.2 AA** como requisito, no como mejora.
9. **Sin dependencias nuevas de interfaz** salvo decisión registrada. La marca,
   la paleta (D-011), Inter (D-006) y `ForjaIcon` se mantienen.

### Tareas

| ID | Tarea | Criterio de aceptación |
| --- | --- | --- |
| F1-01 | Auditoría de UX: recorridos principales (consultar ejercicio, preparar sesión, ejecutar sesión) en 375, 768 y 1280 px, con capturas y problemas priorizados. | **Hecha.** Documento de auditoría en docs/00-project/ux-audit.md con capturas reales y matriz priorizada. |
| F1-02 | Registrar DEC-A con la dirección elegida y prototipos de baja fidelidad de las pantallas clave. | **Hecha.** Registrada como decisión D-017 en decisions.md con prototipos de baja fidelidad. |
| F1-03 | Tokens de diseño ampliados: escala tipográfica fluida (clamp), espaciado, radios, sombras, puntos de ruptura y tamaños táctiles, en orja-tokens.css. | **Hecha.** Sin colores nuevos fuera de D-011; orja-tokens.css ampliado con escalas fluidas y adaptativas, y global.css sin valores mágicos repetidos. |
| F1-04 | Separar global.css (339 líneas) en estilos base y estilos por componente o funcionalidad. | **Hecha.** Separado en 8 módulos CSS especializados en src/styles/ importados en cascada desde global.css; mismo aspecto visual, sin reglas huérfanas y con tests de arquitectura. |
| F1-05 | Biblioteca de componentes base en src/components/ui/: botón, campo, selector, pestañas, plegable, hoja inferior, tarjeta, barra de navegación inferior. | **Hecha.** Creados los 8 componentes base accesibles con suite completa de tests de rol, etiqueta y foco, exportación unificada y estilos encapsulados. |
| F1-06 | Nuevo AppShell adaptativo: barra inferior en móvil, lateral en tableta y escritorio. | **Hecha.** Implementado AppShell adaptativo con barra inferior fija y panel 'Más' en móvil, barra lateral en tableta y escritorio, enlace 'saltar al contenido' accesible y navegabilidad completa por teclado. |
| F1-07 | Tema oscuro. | **Hecha.** Decisión D-018 (DEC-B) registrada; tokens temáticos, contraste WCAG AA matemáticamente probado, persistencia y selector de tema en interfaz. |
| F1-08 | Rediseño del detalle de ejercicio con revelación progresiva. | **Hecha.** Implementado patrón de pestañas accesibles (Prescripción y uso, Técnica y claves, Modificaciones y criterio). Objetivo, dosis y criterios de parada visibles de inmediato en móvil en menos de dos pantallas. |
| F1-09 | Rediseño del catálogo de ejercicios: filtros en hoja inferior en móvil, resultados compactos. | **Hecha.** Filtros táctiles accesibles en hoja inferior modal para móvil con contador de activos, controles completos en escritorio, y anuncio accesible dinámico con role=status y aria-live=polite. |
| F1-10 | Rediseño de sesiones y del constructor: pasos claros y guardado visible. | **Hecha.** Implementado asistente por pasos (stepper accesible), barra inferior fija con estado de autoguardado en tiempo real y navegación paso a paso adaptada a móvil. |
| F1-11 | Modo campo para la ejecución de sesiones. | **Hecha.** Modo campo táctil para sol y pista: vista enfocada de una tarea activa por pantalla, botón táctil de completar en un toque, barra de progreso y navegación entre tareas. |
| F1-12 | Rediseño del Dashboard orientado a la próxima acción (continuar borrador, ejecutar sesión, consultar). | **Hecha.** Tarjeta destacada con la acción inmediata recomendada (continuar último borrador con progreso de tareas o preparar nueva sesión), accesos rápidos y métricas en vivo. |
| F1-13 | Pruebas visuales en 375, 768 y 1280 px de todas las rutas. | **Hecha.** Suite automatizada con Chrome CDP (scripts/test-visual-regression.mjs), 33/33 comprobaciones sin desbordamiento horizontal y capturas generadas en docs/00-project/visual-regression/. |

Orden: F1-01 → F1-02 → F1-03 → F1-04 → F1-05 → F1-06, y después las
pantallas (F1-08 a F1-12) en pull requests separadas. F1-07 puede ir en
paralelo cuando se registre DEC-B.

## Fase 2 — Uso sin conexión (PWA)

Objetivo: que FORJA funcione en el campo sin cobertura.

| ID | Tarea | Criterio de aceptación |
| --- | --- | --- |
| F2-01 | Registrar DEC-C. | **Hecha.** Registrada como decisión D-020 en `decisions.md`. |
| F2-02 | *Service worker* con caché de la aplicación, el contenido y las imágenes de ejercicios. | **Hecha.** Service worker nativo (`sw.js`) con estrategias Cache-first (assets inmutables e imágenes) y Network-first con fallback (HTML), ciclo de vida controlado y tests de offline. |
| F2-03 | Aviso de nueva versión disponible. | **Hecha.** Componente accesible `UpdatePrompt` con `role="status"` y hook reactivo `usePwaUpdate`; la persona usuaria decide cuándo activar la nueva versión sin perder borradores en curso. |
| F2-04 | Exportar e importar borradores y ejecuciones (JSON). | **Hecha.** Exportación/importación nativa en JSON con validadores de esquema `isBackupData`, fusión idempotente de registros, feedback accesible y tests exhaustivos. |

## Fase 3 — Búsqueda global

Objetivo: encontrar ejercicios, sesiones y términos del glosario desde
cualquier pantalla (hoja de ruta, Fase 6).

| ID | Tarea | Criterio de aceptación |
| --- | --- | --- |
| F3-01 | Índice de búsqueda generado a partir del Markdown ya cargado, sin servicios externos. | **Hecha.** Índice de búsqueda local generado en cliente desde Markdown con normalización de diacríticos, coincidencia prefija y por tokens para ejercicios, sesiones y glosario. |
| F3-02 | Interfaz de búsqueda: campo en la barra en escritorio, pantalla completa en móvil, atajo de teclado. | **Hecha.** Modal global accesible con atajo (`Ctrl+K` / `⌘K`), navegación por teclado, chips rápidos, filtros por tipo y foco trampa (`GlobalSearch`). |
| F3-03 | Glosario navegable en la aplicación, enlazado desde los términos de las fichas. | **Hecha.** Glosario navegable en `/library`, filtrado por término y letra, panel lateral accesible `GlossaryDrawer` y chips in situ en fichas de ejercicio. |

## Fase 4 — Evaluación y seguimiento

Objetivo: el módulo que necesita el caso Proyecto Iker.

| ID | Tarea | Criterio de aceptación |
| --- | --- | --- |
| F4-01 | Contenido de `docs/08-assessments/` a partir de MET-001. | **Hecha.** Creados `assessment-standard.md` (EVAL-STD-001) y `eval-001-initial-movement-competence.md` (EVAL-001) basados en MET-001 y gobernados por D-021. |
| F4-02 | Modelo de dominio y lectura desde Markdown de las evaluaciones. | **Hecha.** Implementados tipos de dominio, parser tipado y catálogo en `src/features/assessments/`; `problems` vacío y trazabilidad con la biblioteca de ejercicios verificada en los tests. |
| F4-03 | Registro de evaluaciones e indicadores de progreso. | **Hecha.** Implementado modelo `AssessmentRecord`, persistencia local `forja.assessments.records.v1` bajo D-021, comparador de progreso por patrón, pantallas `AssessmentCatalogPage` y `AssessmentRecordPage`, y suites de pruebas completas. |

## Fase 5 — Deportistas y Proyecto Iker

Objetivo: aplicar FORJA a deportistas concretos sin mezclar casos personales
con la metodología.

| ID | Tarea | Criterio de aceptación |
| --- | --- | --- |
| F5-01 | Registrar DEC-D. | **Hecha.** Decisión D-021 registrada en `docs/00-project/decisions.md`: almacenamiento cliente sin servidor, minimización y seudonomización, portabilidad total y derecho de supresión. |
| F5-02 | Módulo `athletes`: perfil mínimo, sesiones ejecutadas y evaluaciones asociadas. | **Hecha.** Implementado módulo `athletes` con almacenamiento local `forja.athletes.v1`, exportación e importación JSON, derecho de supresión total (D-021) y vinculación con evaluaciones y sesiones. |
| F5-03 | Desarrollo del caso en `examples/proyecto-iker/`. | **Contenido.** Sin datos identificables innecesarios. |

## Fase 6 — Programación

Objetivo: activar la ruta «Programación» con planificación semanal.

| ID | Tarea | Criterio de aceptación |
| --- | --- | --- |
| F6-01 | Contenido de `docs/07-programs/` a partir de MET-005. | **Contenido.** Documentos revisados. |
| F6-02 | Vista semanal que coloca sesiones respecto al calendario deportivo (MD-1, MD+1…). | Las etiquetas siguen el glosario y MET-005. |

## Fase 7 — Motor de adaptación

Bloqueada por DEC-E. Hasta que la decisión exista, no se diseña ni se
implementa. Cualquier propuesta debe respetar que el criterio final es del
entrenador.

## Contenido en paralelo

Trabajo editorial que no depende del código y que una persona redacta y revisa.
Los agentes pueden preparar índices, enlaces y estructura.

- Validación práctica de SES-001 a SES-003 con deportistas reales (próximo
  hito de la hoja de ruta).
- Definir los 12
  [términos pendientes del glosario](../01-foundations/glossary.md#términos-pendientes-de-definición)
  en sus documentos de origen.
- Fundamentos científicos pendientes: sueño, nutrición general y prevención de
  lesiones.
- Bibliografía en `docs/09-references/`.
- Aprobación visual final de EX-002 (niveles 2 y 3) y EX-007 (nivel 2).
- Lotes posteriores de fichas: potencia y velocidad; desaceleración y
  multidireccional.
- Primeros registros en `adr/` y estructuras en `schemas/`.

## Orden recomendado

```text
Fase 0  ──►  Fase 1  ──►  Fase 2  ──►  Fase 3
                                         │
Contenido 08-assessments ──────────►  Fase 4  ──►  Fase 5
Contenido 07-programs   ─────────────────────────►  Fase 6
DEC-E ───────────────────────────────────────────►  Fase 7
```

La Fase 1 va primero porque todas las pantallas nuevas (evaluación,
deportistas, programación) deben nacer con el nuevo sistema de navegación y
componentes, en lugar de rehacerse después.
