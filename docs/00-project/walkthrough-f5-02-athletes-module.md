# Walkthrough — Tarea F5-02: Módulo athletes con perfil mínimo, evaluaciones y sesiones asociadas

## Objetivo

Implementar el módulo `athletes` de la aplicación FORJA para gestionar perfiles seudonimizados de deportistas jóvenes, respetando de forma estricta los principios de privacidad, minimización, derecho de supresión y portabilidad total definidos en la decisión `D-021` (`DEC-D`).

## Decisiones tomadas

1. **Modelo de dominio en `domain/athlete.ts`**:
   - `Athlete`: identificador técnico seudonimizado (`id`), alias (`alias`), deporte (`sport`), etapa de maduración biológica (`stage`: `pre_phv`, `circa_phv`, `post_phv`, `unknown`), notas contextuales y marcas temporales.
   - Sin campos sensibles: prohibición de DNI, apellidos completos, direcciones o datos médicos identificables.
   - `AthleteExportData`: paquete JSON versión 1 que agrupa el perfil, sus evaluaciones registradas y sus ejecuciones de sesión.
   - Validadores estrictos `isAthlete(value)` e `isAthleteExportData(value)`.
2. **Persistencia local en `data/athleteStorage.ts`**:
   - Clave versionada `forja.athletes.v1` en `localStorage`.
   - `exportAthleteData` y `importAthleteData` para garantizar la portabilidad y propiedad de los datos por parte de la familia/entrenador sin intermediarios.
   - Borrado en cascada con `deleteAthlete(..., deleteAssociatedData = true)` garantizando el derecho al olvido y la supresión completa de evaluaciones asociadas.
3. **Presentación en `pages/AthletesPage.tsx`**:
   - Vista de catálogo de deportistas y formulario accesible para crear/editar perfiles.
   - Enlace directo a evaluación motriz (`/assessments/eval-001/record`).
   - Acciones de exportación de copia de seguridad local (archivo JSON descargable) e importación desde archivo.
   - Integración de ruta en `src/app/router.tsx` bajo `/athletes` y activación del área en el Dashboard (`ready: true`).

## Archivos modificados

- `src/features/athletes/domain/athlete.ts`: Modelo de datos y validadores de esquema de deportistas y exportaciones.
- `src/features/athletes/data/athleteStorage.ts`: Persistencia y portabilidad bajo D-021.
- `src/features/athletes/data/athleteStorage.test.ts`: Tests unitarios de validación, persistencia, exportación, importación y supresión.
- `src/features/athletes/pages/AthletesPage.tsx`: Pantalla principal del módulo de deportistas.
- `src/features/athletes/pages/AthletesPage.test.tsx`: Tests de interfaz y flujos de usuario.
- `src/app/router.tsx`: Enrutado activo para `/athletes`.
- `src/pages/DashboardPage.tsx`: Módulo «Atletas» marcado como activo (`ready: true`).
- `docs/00-project/implementation-plan.md`: Marca F5-02 como **Hecha**.

## Verificación

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run check:links`
