# PROG-STD-001 — Estándar de programa y microciclo semanal FORJA

## Estado

Primera versión completa, en revisión.

## Propósito

Definir cómo se estructura, documenta y adapta un programa o microciclo semanal en FORJA para articular los estímulos de preparación física con el deporte principal, la competición y el contexto vital del joven deportista.

Este estándar transforma operativamente los principios y decisiones de [MET-005 — Planificación semanal y relación con el deporte](../03-methodology/weekly-planning-and-sport-integration.md).

## Alcance

PROG-STD-001 establece:

- la nomenclatura de días respecto al partido de competición (`MD-x`, `MD`, `MD+x`);
- los elementos obligatorios para definir un microciclo semanal;
- la compatibilidad entre el deporte principal y las sesiones FORJA;
- los criterios para modular dosis según distancia al partido y carga acumulada;
- las adaptaciones dinámicas ante variaciones de exposición (titular vs suplente, cancelaciones, semanas con dos partidos).

No establece:

- una plantilla universal e inmutable aplicable a todos los contextos;
- periodizaciones complejas desconectadas de la realidad del deportista;
- sustitución del criterio del entrenador ante situaciones imprevistas.

## Documentos de referencia

- [MET-001 — Evaluación inicial del joven deportista](../03-methodology/initial-athlete-assessment.md);
- [MET-003 — Construcción de sesiones FORJA](../03-methodology/session-construction.md);
- [MET-004 — Dosificación y prescripción FORJA](../03-methodology/dosage-and-prescription.md);
- [MET-005 — Planificación semanal y relación con el deporte](../03-methodology/weekly-planning-and-sport-integration.md);
- [SES-STD-001 — Estándar de sesión FORJA](../06-sessions/session-standard.md).

## Principios fundamentales

### 1. El deporte principal tiene prioridad contextual (`F-WEEK-002`)

FORJA no compite con el entrenamiento del club ni con los partidos; complementa y optimiza el desarrollo del deportista integrándose en su calendario real.

### 2. No existe una plantilla MD universal (`F-WEEK-005`)

Las etiquetas como `MD-1`, `MD-2` o `MD+1` orientan sobre la proximidad al partido, pero el contenido de cada día depende de la exposición real acumulada, no de una regla algorítmica rígida.

### 3. La proximidad al partido modifica el coste aceptable (`F-WEEK-004`)

- **Días alejados de competición** (`MD-4`, `MD-3`): mayor margen para estímulos de fuerza y desarrollo motor.
- **Días próximos a competición** (`MD-2`, `MD-1`): prioridad en frescura neuromuscular, calidad técnica y dosis mínimas de activación sin fatiga residual.
- **Día posterior** (`MD+1`): la intervención depende de los minutos disputados (`F-WEEK-006`).

### 4. Mantener también es progresar (`F-WEEK-014`)

En semanas con alta exigencia escolar, viajes o múltiples partidos, reducir a microdosis de mantenimiento es una decisión metodológica de alta calidad, no un retroceso.

---

## Estructura obligatoria de una ficha de programa

Toda ficha canónica en `docs/07-programs/` debe contener las siguientes secciones:

1. **Encabezado**: Identificador `PROG-NNN` y título claro orientado al contexto deportivo.
2. **Estado**: Nivel de madurez editorial del documento.
3. **Propósito**: Justificación y objetivo general del microciclo.
4. **Contexto de aplicación**: Deporte, frecuencia competitiva, sesiones de club y disponibilidad estimada.
5. **Esquema de distribución semanal**: Tabla estructurada con:
   - Día de la semana (Lunes a Domingo);
   - Etiqueta de proximidad competitiva (`MD-x`, `MD+x`, `MD`, `Off`);
   - Carga deportiva del club (entrenamiento, descanso, partido);
   - Estímulo FORJA asignado (sesión canónica `SES-NNN` o microdosis);
   - Prioridad y coste residual aceptable.
6. **Criterios de adaptación dinámica**:
   - Variación por minutos disputados (titular vs suplente);
   - Ajuste por fatiga o reducción de disponibilidad;
   - Criterios de parada o sustitución semanal.
