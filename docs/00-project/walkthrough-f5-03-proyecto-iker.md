# Walkthrough — Tarea F5-03: Desarrollo del caso en examples/proyecto-iker/

## Objetivo

Desarrollar el caso práctico `examples/proyecto-iker/` documentando la aplicación de FORJA en un futbolista sub-14 en ventana circa-PHV previa a la pretemporada deportiva, manteniendo la estricta separación entre la metodología general y los datos de un caso particular, conforme a las directivas de privacidad de la decisión `D-021`.

## Decisiones tomadas

1. **Memoria técnica en `examples/proyecto-iker/caso-iker.md`**:
   - Registro de contexto deportivo y madurativo seudonimizado.
   - Evaluación inicial basada en la batería canónica `EVAL-001`, mapeando cada una de las 8 tareas motrices a su estado de competencia y ejercicio de entrada en la biblioteca (`EX-002`, `EX-003`, `EX-005`, `EX-008`, `EX-011`, `EX-013`, `EX-014`).
   - Propuesta de periodización de 2 sesiones semanales espaciadas 72 h basadas en las plantillas canónicas `SES-001` y `SES-002`.
   - Criterios individuales de parada basados en dolor perióstico/apofisario y fatiga neuromuscular.
2. **Ficha de datos exportable en `examples/proyecto-iker/iker-perfil-export.json`**:
   - Formato JSON versión 1 completamente validado por `isAthleteExportData`.
   - Incluye el perfil seudonimizado de Iker y su evaluación inicial.
   - Importable directamente en la aplicación a través del botón «Importar JSON» del módulo de deportistas.
3. **Integridad y pruebas**:
   - Añadida prueba en `athleteStorage.test.ts` que valida e importa exitosamente la ficha del Proyecto Iker.

## Archivos modificados

- `examples/proyecto-iker/README.md`: Actualizada documentación e índice del proyecto.
- `examples/proyecto-iker/caso-iker.md`: Memoria técnica del caso práctico.
- `examples/proyecto-iker/iker-perfil-export.json`: Ficha de datos en formato portable D-021.
- `src/features/athletes/data/athleteStorage.test.ts`: Test de validación e importación de la ficha oficial del caso.
- `docs/00-project/implementation-plan.md`: Marca F5-03 como **Hecha**.

## Verificación

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run check:links`
