# Walkthrough — Tarea F6-01: Contenido canónico de docs/07-programs/ a partir de MET-005

## Objetivo

Desarrollar el contenido canónico de la metodología de planificación semanal y programas en `docs/07-programs/`, transformando los principios de `MET-005` (`weekly-planning-and-sport-integration.md`) en un estándar operativo reutilizable y dos fichas canónicas de microciclos para fútbol y preparación física formativa.

## Decisiones tomadas

1. **Estándar PROG-STD-001 (`docs/07-programs/program-standard.md`)**:
   - Nomenclatura normalizada de proximidad al partido: `MD-x`, `MD+x`, `MD`, `Off`.
   - Principios derivados de `MET-005` (F-WEEK-001 a F-WEEK-018): prioridad contextual del deporte, modulación del coste de fatiga según distancia a competición, y la premisa fundamental de que «mantener también es progresar».
   - Estructura obligatoria para fichas de programa: encabezado, propósito, contexto previsto, tabla de distribución semanal de estímulos y criterios de adaptación dinámica.
2. **Programa PROG-001 (`docs/07-programs/prog-001-in-season-single-match.md`)**:
   - Microciclo competitivo estándar con un partido en fin de semana y 3 entrenamientos de club.
   - Integración de `SES-002` (Fuerza general) en `MD-5` (martes, día alejado) y `SES-003` (Fuerza breve compatible con fútbol) en `MD-3` (jueves).
   - Adaptaciones documentadas ante minutos disputados (titular vs suplente) y fatiga/exámenes escolares.
3. **Programa PROG-002 (`docs/07-programs/prog-002-preseason-development.md`)**:
   - Microciclo preparatorio de pretemporada sin competición oficial.
   - Dos sesiones semanales principales de fuerza (`SES-001` y `SES-002`) con intervalo de 72 horas para máxima asimilación técnica y desarrollo neuromuscular.
4. **Actualización de índices**:
   - `docs/07-programs/README.md` actualizado con el catálogo e hiperenlaces a las sesiones canónicas.
   - `docs/index.md` actualizado reflejando la madurez de los módulos 07 y 08.

## Archivos modificados

- `docs/07-programs/program-standard.md`: Nuevo estándar `PROG-STD-001`.
- `docs/07-programs/prog-001-in-season-single-match.md`: Ficha canónica del microciclo competitivo.
- `docs/07-programs/prog-002-preseason-development.md`: Ficha canónica del microciclo preparatorio.
- `docs/07-programs/README.md`: Catálogo e índice del módulo de Programas.
- `docs/index.md`: Inclusión de los nuevos documentos en el índice maestro.
- `docs/00-project/implementation-plan.md`: Marcada tarea F6-01 como **Hecha**.

## Verificación

- `npm run check:links` (138 archivos, 1159 enlaces, 0 problemas).
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
