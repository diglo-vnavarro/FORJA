# Contribuir a FORJA

FORJA se desarrolla mediante documentación versionada y revisiones por pull request.

## Flujo recomendado

1. Crear una rama desde `main`.
2. Realizar un cambio enfocado en un único objetivo.
3. Revisar claridad, coherencia, enlaces y referencias.
4. Crear un commit descriptivo.
5. Abrir una pull request inicialmente como draft.
6. Explicar qué cambia, por qué y qué queda pendiente.
7. Solicitar revisión antes de integrar.

## Convención de ramas

Ejemplos:

```text
docs/project-vision
science/growth-and-maturation
methodology/training-principles
content/squat-pattern
app/initial-prototype
```

## Convención de commits

Ejemplos:

```text
docs: define FORJA vision
science: add growth and maturation review
methodology: define progression criteria
content: add split squat exercise profile
chore: fix documentation links
```

## Criterios mínimos de aceptación

Las normas completas se detallan en
[`docs/01-foundations/editorial-standards.md`](docs/01-foundations/editorial-standards.md).
Un documento debe:

* tener un propósito claro;
* distinguir evidencia y metodología;
* evitar afirmaciones sin respaldo;
* utilizar terminología coherente;
* enlazar las fuentes correspondientes;
* poder comprenderse sin consultar conversaciones externas;
* no incluir información personal innecesaria.

## Comprobaciones automáticas

Cada pull request ejecuta en GitHub Actions las mismas comprobaciones que pueden
lanzarse en local:

```text
npm run typecheck
npm run lint
npm test
npm run build
npm run check:links
```

La aplicación lee las fichas de `docs/05-exercises/library/` y las sesiones de
`docs/06-sessions/` directamente desde su Markdown. Un cambio editorial que
elimine o renombre una sección obligatoria, o que rompa la tabla de tareas de
una sesión, hace fallar los tests en lugar de mostrarse vacío en la aplicación.

Los bloques de las sesiones conservan identificadores estables en
`src/features/sessions/data/sessionDocuments.ts`: los borradores guardados en el
navegador dependen de ellos. Añadir, quitar o reordenar bloques exige actualizar
esa lista.

## Casos personales

Los ejemplos personales deberán mantenerse en `examples/`.

No se incluirán nombres completos, datos médicos sensibles ni información identificable que no sea necesaria para comprender el caso.
