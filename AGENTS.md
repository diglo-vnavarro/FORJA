# Instrucciones para agentes y colaboradores

Este archivo define las reglas que debe respetar cualquier persona o agente de
inteligencia artificial que trabaje en FORJA, sea cual sea la herramienta que
utilice.

Describe el estado real del repositorio. Si el código o la documentación
cambian y este archivo deja de reflejarlos, debe actualizarse en la misma pull
request.

## Propósito

FORJA es un sistema de conocimiento y toma de decisiones para el desarrollo
físico de jóvenes deportistas.

No es una colección de rutinas ni una aplicación de generación automática de
entrenamientos.

## Resumen del proyecto

El repositorio contiene dos partes que deben mantenerse alineadas:

1. **Documentación metodológica** (`docs/`), en Markdown. Es la fuente de
   verdad del contenido: fundamentos científicos, metodología, fichas de
   ejercicio y sesiones.
2. **Aplicación web** (`src/`), una SPA que lee directamente ese Markdown y lo
   presenta a quien entrena. No genera contenido metodológico propio.

Módulos de la aplicación:

| Módulo | Ruta | Función |
| --- | --- | --- |
| `exercises` | `/exercises` | Catálogo y detalle de las fichas de `docs/05-exercises/library/`. También la producción visual de derivados (`/visual-production/:exerciseId`). |
| `sessions` | `/sessions` | Catálogo y detalle de las sesiones de `docs/06-sessions/`. |
| `session-builder` | `/sessions/prepare`, `/sessions/saved` | Preparación de borradores a partir de una sesión canónica, guardados en el navegador. |
| `session-execution` | `/sessions/execute/:draftId` | Registro de la ejecución de un borrador. |
| `design-system/forja` | — | Tokens, marca e iconografía (`ForjaIcon`). |

Las rutas `planning`, `athletes` y `library` muestran `ComingSoonPage`: no
existen todavía como módulos.

## Stack tecnológico

Versiones según `package.json`:

| Ámbito | Tecnología |
| --- | --- |
| Lenguaje | TypeScript `~5.9` en modo `strict` |
| Interfaz | React `^19.2` |
| Enrutado | React Router `^7.9` (`createBrowserRouter`, rutas `lazy`) |
| Compilación | Vite `^7.2` con `@vitejs/plugin-react` |
| Tests | Vitest `^4.0`, jsdom, Testing Library (`react`, `user-event`, `jest-dom`) |
| Lint | ESLint `^9` (configuración plana), `typescript-eslint`, `react-hooks`, `react-refresh` |
| Tipografía | Inter mediante `@fontsource-variable/inter` (decisión D-006) |
| Iconografía | `@tabler/icons-react`, solo a través de `ForjaIcon` |
| CI | GitHub Actions, Node 22 |

Lo que la aplicación **no** tiene, y no debe introducirse sin una decisión
registrada:

- biblioteca de estado global (Redux, Zustand, etc.): se usa estado local de
  React;
- cliente HTTP ni backend: no hay llamadas de red;
- base de datos: la única persistencia es `localStorage`, con esquemas
  versionados;
- biblioteca de componentes o de estilos (Tailwind, CSS-in-JS, etc.): los
  estilos son CSS plano con los tokens de FORJA.

## Fuente oficial

La rama `main` contiene únicamente contenido revisado y aceptado.

Las ideas surgidas en conversaciones, borradores externos o respuestas de
herramientas de inteligencia artificial no se consideran parte de FORJA hasta
quedar incorporadas mediante una pull request.

## Reglas de contenido

1. No inventar referencias científicas.
2. No presentar opiniones metodológicas como hechos demostrados.
3. Diferenciar claramente, según
   [los niveles de evidencia](docs/01-foundations/evidence-levels.md):
   - evidencia científica;
   - consenso profesional;
   - decisión metodológica propia;
   - hipótesis pendiente de validación.
4. Evitar afirmaciones categóricas cuando existan incertidumbre o diferencias
   individuales.
5. Priorizar el desarrollo y bienestar a largo plazo sobre el rendimiento
   inmediato.
6. No prescribir cargas únicamente a partir de la edad cronológica.
7. Mantener la separación entre metodología general y casos personales.
8. Utilizar lenguaje comprensible, preciso y no sensacionalista.
9. No introducir ejercicios sin explicar su propósito, contexto y criterios de
   aplicación.
10. No modificar el alcance del proyecto sin registrar la decisión.

## Reglas editoriales

- Idioma principal: español.
- Formato principal: Markdown.
- Títulos descriptivos y orientados al contenido.
- Un documento debe poder entenderse sin depender de una conversación externa.
- Evitar repeticiones y frases promocionales.
- Definir los términos técnicos en el [glosario](docs/01-foundations/glossary.md).
- Utilizar enlaces relativos entre documentos.
- Mantener líneas razonablemente cortas cuando no perjudique la legibilidad.
- No utilizar emojis en la documentación técnica o científica.

## Arquitectura de la aplicación

### Patrón

La aplicación sigue una organización **por funcionalidad** (*feature-based*).
Cada funcionalidad se divide en capas con una dirección de dependencia fija:

```text
pages  →  components  →  data  →  domain
```

| Capa | Contenido | Puede depender de |
| --- | --- | --- |
| `domain/` | Tipos, funciones puras, validadores (`isX`). Sin React ni `localStorage`. | Otros `domain/`, tipos de `design-system`. |
| `data/` | Lectura de Markdown, *parsers*, catálogos, selectores y persistencia en el navegador. | `domain/`. |
| `components/` | Componentes de presentación propios de la funcionalidad. | `domain/`, `data/`, `components/ui`, `design-system`. |
| `pages/` | Pantallas enlazadas desde el router. Coordinan estado y datos. | Todo lo anterior. |

No es Clean Architecture ni DDD en sentido estricto: no hay repositorios,
casos de uso ni inyección de dependencias formales. Las dependencias externas
(`localStorage`, la fecha actual) se reciben como parámetros con valor por
defecto para poder sustituirlas en los tests:

```ts
export function loadSessionDrafts(storage: Pick<Storage, "getItem"> = localStorage, now = new Date()) { … }
```

### El documento es la fuente de verdad

Las fichas de ejercicio y las sesiones no se duplican en TypeScript. Se
importan como texto con `?raw` y se convierten al modelo de la aplicación:

- `src/features/exercises/data/exerciseDocuments.ts` y `documentAdapter.ts`;
- `src/features/sessions/data/sessionDocuments.ts` y
  `sessionDocumentParser.ts`.

Consecuencias:

- El código solo añade metadatos técnicos que el documento no contiene (slug
  de la URL, identificadores estables de bloque).
- Cambiar un encabezado obligatorio de una ficha o la tabla de tareas de una
  sesión rompe los tests. Es intencionado.
- Los `blockIds` de `sessionDocuments.ts` son estables: los borradores
  guardados identifican sus tareas como `${blockId}-${índice}`. Añadir, quitar
  o reordenar bloques de una sesión exige actualizar esa lista.

### Estructura de carpetas

```text
src/
├── main.tsx                  Punto de entrada: router, fuente y estilos globales.
├── app/                      Router, shell y utilidades de enrutado.
│   ├── router.tsx
│   ├── lazyComponent.ts
│   └── shell/AppShell.tsx
├── components/ui/            Componentes genéricos sin conocimiento de dominio.
├── pages/                    Páginas transversales (Dashboard, 404, ComingSoon).
├── features/<funcionalidad>/ domain/, data/, components/, pages/ (y otras
│                             carpetas específicas, como visual-production/).
├── design-system/forja/      Marca, tokens e iconografía. Tiene su propio AGENTS.md.
├── styles/global.css         Estilos de la aplicación.
└── test/setup.ts             Configuración común de los tests.

docs/                         Metodología en Markdown (fuente del contenido).
scripts/                      Utilidades Node (enlaces, derivados de ejercicios).
assets/                       Marca, iconos y recursos visuales de ejercicios.
examples/                     Casos personales, separados de la metodología.
adr/, schemas/                Pendientes de desarrollo.
```

Dónde va cada cosa:

| Necesito… | Ubicación |
| --- | --- |
| Una nueva pantalla de una funcionalidad existente | `src/features/<f>/pages/` y su ruta en `src/app/router.tsx` |
| Un tipo o una regla pura | `src/features/<f>/domain/` |
| Leer un documento, filtrar o guardar en el navegador | `src/features/<f>/data/` |
| Un componente reutilizable entre funcionalidades | `src/components/ui/` |
| Un icono nuevo | Mapa de `src/design-system/forja/src/icons/` (ver Sistema visual) |
| Un color o una medida de marca | Token en `forja-tokens.css` |
| Contenido metodológico | `docs/`, nunca en el código |

### Convenciones de nombres

| Elemento | Convención | Ejemplo |
| --- | --- | --- |
| Carpeta de funcionalidad | `kebab-case` | `session-builder/` |
| Componente React y su archivo | `PascalCase`, exportación con nombre igual al archivo | `SessionCard.tsx` → `export function SessionCard` |
| Página | Sufijo `Page` | `SessionDetailPage.tsx` |
| Módulo no React | `camelCase.ts` | `sessionDraftStorage.ts` |
| Test | Junto al archivo probado, `.test.ts` o `.test.tsx` | `sessionDraft.test.ts` |
| Tipos | `PascalCase`, declarados con `type` | `SessionDraft` |
| Validadores | `isX(value: unknown): value is X` | `isSessionDraft` |
| Constantes de módulo | `UPPER_SNAKE_CASE` | `SESSION_DRAFTS_STORAGE_KEY` |
| Claves de `localStorage` | `forja.<funcionalidad>.<nombre>.v<N>` | `forja.session-builder.drafts.v2` |
| Identificadores de contenido | `EX-NNN`, `SES-NNN` | `EX-002`, `SES-001` |
| Clases CSS | Estilo BEM: `bloque__elemento--modificador` | `exercise-hero__media`, `badge--blue` |
| Alias de importación | `@/` apunta a `src/` | `@/features/sessions/data/sessions` |

Idiomas:

- Identificadores de código y descripciones de tests (`describe`, `it`): inglés.
- Textos de la interfaz, comentarios del código y mensajes de problemas
  detectados por los *parsers*: español.

## Reglas y restricciones del código

### Lo que nunca se debe hacer

- Escribir contenido metodológico (prescripciones, criterios, consignas)
  directamente en TypeScript en lugar de en `docs/`.
- Importar iconos de Tabler fuera de `src/design-system/forja/`.
- Añadir dependencias (estado global, HTTP, estilos, iconos, utilidades) sin
  una decisión registrada en
  [`docs/00-project/decisions.md`](docs/00-project/decisions.md).
- Usar exportaciones por defecto en componentes o páginas: el router resuelve
  las páginas por nombre mediante `lazyComponent`.
- Leer `localStorage` sin validar la estructura con un `isX` y sin versión de
  esquema.
- Cambiar el formato persistido sin migrar los datos anteriores (ver
  `migrateLegacyDraft` en `sessionDraftStorage.ts`).
- Cambiar los `blockIds` de una sesión sin revisar los borradores existentes.
- Repetir valores de color de marca cuando existe un token.
- Modificar los masters de `src/design-system/forja/brand/` o de
  `assets/brand/master/`.
- Usar `any` para silenciar el compilador o desactivar reglas de ESLint sin
  justificarlo en un comentario.
- Incluir datos personales de deportistas fuera de `examples/`.

### Manejo de errores

La aplicación no lanza excepciones en el flujo normal. Los patrones vigentes
son:

| Situación | Patrón |
| --- | --- |
| Lectura de `localStorage` | `try/catch` que devuelve un valor vacío (`[]`, `null`); nunca rompe la interfaz. |
| Datos persistidos de origen dudoso | Validador `isX(value: unknown)` antes de usarlos; lo que no valida se descarta. |
| Documento Markdown mal estructurado | El *parser* devuelve `{ resultado, problems: string[] }`. Los tests exigen que `problems` esté vacío. En desarrollo se avisa con `console.warn` bajo `import.meta.env.DEV`. |
| Recurso inexistente (ID de URL) | La página muestra `EmptyState` con un enlace de vuelta, no un error. |
| Ruta desconocida | `NotFoundPage`. |

Las funciones de búsqueda devuelven `undefined` o `null` cuando no encuentran
el elemento; quien las llama decide qué mostrar.

### Estilo de código

- TypeScript en modo `strict`; el código debe pasar `npm run typecheck` y
  `npm run lint` sin errores.
- Componentes de función con exportación nombrada; sin componentes de clase.
- Funciones puras en `domain/`; efectos y estado en `pages/`.
- Objetos inmutables: se devuelven copias (`{ ...draft }`, `[...items]`).
- Estilos en `src/styles/global.css` (o en un CSS propio de la funcionalidad,
  como `exercise-derivatives.css`) usando variables de `forja-tokens.css`.
- Accesibilidad: controles de formulario con etiqueta, `aria-label` en la
  navegación, `role="status"` para confirmaciones. Los tests localizan los
  elementos por rol y etiqueta, lo que obliga a mantenerlos.
- No hay Prettier configurado. Se respeta el formato del archivo que se
  modifica: comillas dobles, punto y coma y sangría de dos espacios.

## Testing y calidad

### Herramientas

- **Vitest** con entorno `jsdom` y `globals: true` (`describe`, `it`, `expect`
  sin importar). Configuración en `vite.config.ts`.
- **Testing Library** para componentes y páginas; `user-event` para la
  interacción.
- `src/test/setup.ts` carga `@testing-library/jest-dom/vitest`.

### Estructura de los tests

- Un archivo de test junto a cada módulo probado.
- Tests de `domain/` y `data/`: funciones puras con entradas explícitas
  (fechas e IDs fijos, `storage` falso o `localStorage` limpiado en
  `beforeEach`).
- Tests de `pages/`: se renderiza la página dentro de `MemoryRouter` y se
  comprueba lo que ve y hace la persona usuaria, por rol y texto.
- Tests de integridad del contenido: la biblioteca leída desde Markdown no
  tiene problemas de estructura, todas las referencias `EX-NNN` existen y los
  archivos de origen están en el repositorio.

### Criterios mínimos para un módulo nuevo

No hay un umbral numérico de cobertura configurado. Un módulo nuevo debe
incluir, como mínimo:

1. tests de cada función de `domain/` con lógica (no de los tipos);
2. tests de persistencia si escribe en `localStorage`: guardado, lectura,
   datos corruptos y migración si cambia el esquema;
3. un test por página que cubra el flujo principal y el caso de recurso
   inexistente;
4. si lee documentos de `docs/`, un test que exija `problems` vacío.

### Comprobaciones obligatorias

Las mismas que ejecuta la CI en cada pull request
(`.github/workflows/ci.yml`):

```text
npm run typecheck
npm run lint
npm test
npm run build
npm run check:links
```

Una pull request no se considera lista mientras alguna falle.

## Sistema visual FORJA

Estas reglas se aplican a cualquier interfaz, ficha o activo visual del
repositorio. El detalle está en
[`src/design-system/forja/AGENTS.md`](src/design-system/forja/AGENTS.md).

- Los archivos de `src/design-system/forja/brand/` son los masters canónicos
  de la identidad FORJA. No deben redibujarse, regenerarse, sustituirse ni
  reconstruirse desde capturas de pantalla.
- `ForjaIcon`, en `src/design-system/forja/src/icons/`, es la API oficial para
  la iconografía semántica de aplicación.
- Los componentes de negocio no deben importar iconos de Tabler directamente.
  Deben solicitar el concepto mediante `ForjaIcon` y su mapa oficial.
- No se incorporarán nuevas bibliotecas de iconos sin una decisión explícita
  del sistema de diseño.
- Los colores de identidad e iconografía deben utilizar los tokens de
  `forja-tokens.css`; no deben repetirse como valores hardcodeados cuando
  exista un token equivalente.
- La geometría de marca e iconos aprobados es inmutable; el color es
  tematizable mediante `currentColor` y tokens.
- Si falta un concepto en el mapa oficial, debe registrarse como
  `MISSING_FORJA_ASSET`. No se improvisará un icono en el consumidor.
- El trazo predeterminado de la iconografía FORJA es `1.8`, salvo una
  especificación visual explícita.

## Reglas de Git

- No trabajar directamente sobre `main`.
- Crear una rama específica para cada cambio.
- Mantener cada pull request enfocada en un único objetivo.
- Usar commits descriptivos, con las convenciones de
  [`CONTRIBUTING.md`](CONTRIBUTING.md).
- No mezclar cambios editoriales, científicos y técnicos sin necesidad.
- Abrir inicialmente las pull requests como draft.
- Revisar enlaces y formato antes de solicitar la integración.

## Flujo de trabajo para módulos y refactorizaciones

Este flujo se aplica a módulos nuevos y a refactorizaciones de alcance amplio.
Los cambios pequeños siguen solo las reglas de Git.

### 1. Construcción autocontenida

- El trabajo se hace en una rama propia y no depende de cambios sin integrar
  de otras ramas.
- Un módulo nuevo vive en `src/features/<funcionalidad>/` con sus capas y sus
  tests. Fuera de esa carpeta solo se tocan los puntos de integración
  imprescindibles (la ruta en `router.tsx`, la navegación en `AppShell.tsx`,
  estilos en `global.css`, iconos en el mapa del sistema de diseño).
- Una refactorización no cambia el comportamiento visible. Si lo cambia, se
  separa en otra pull request.
- El contenido metodológico que el módulo necesite se incorpora en una pull
  request de documentación aparte, que se revisa antes.

### 2. Walkthrough antes de cerrar

Antes de dar un módulo por terminado se crea un archivo `walkthrough.md` en la
raíz de la carpeta del módulo (por ejemplo,
`src/features/<funcionalidad>/walkthrough.md`) con:

1. **Objetivo**: qué resuelve y qué queda fuera.
2. **Decisiones tomadas**: cada decisión técnica, la alternativa descartada y
   el motivo. Las que afecten a la metodología o al alcance se marcan como
   pendientes de aprobación, no como adoptadas.
3. **Archivos modificados**: lista de archivos creados, modificados y
   eliminados, con una línea sobre cada uno.
4. **Verificación**: resultado de las comprobaciones obligatorias y de la
   revisión manual realizada.
5. **Pendiente**: limitaciones conocidas y trabajo posterior.

El contenido del walkthrough se resume también en la descripción de la pull
request.

### 3. Validación previa a la pull request

Antes de pedir revisión, quien haya hecho el cambio, persona o agente,
comprueba el código contra este archivo:

- [ ] Las capas respetan la dirección `pages → components → data → domain`.
- [ ] Los nombres siguen las convenciones de esta guía.
- [ ] No aparece ninguno de los antipatrones de «Lo que nunca se debe hacer».
- [ ] El manejo de errores sigue los patrones vigentes.
- [ ] Los tests cubren los criterios mínimos.
- [ ] Las cinco comprobaciones obligatorias pasan en local.
- [ ] El sistema visual se respeta (iconos, tokens, masters).
- [ ] No se ha creado contenido metodológico en el código.
- [ ] Existe `walkthrough.md` y está al día.
- [ ] Si una regla de este archivo ha cambiado, el cambio está justificado y
      registrado.

## Responsabilidades de los agentes

Los agentes pueden:

- crear o modificar archivos conforme a instrucciones aprobadas;
- reorganizar contenido sin cambiar su significado;
- validar enlaces y formato;
- preparar commits y pull requests;
- detectar contradicciones o contenido sin referencias.

Los agentes no deben:

- adoptar decisiones metodológicas por iniciativa propia;
- fabricar datos, fuentes o consensos;
- ampliar el alcance sin autorización;
- transformar borradores en contenido definitivo sin revisión;
- incluir información personal identificable en la metodología general.

## Prioridad de instrucciones

En caso de conflicto, se aplicará el siguiente orden:

1. Seguridad y bienestar del deportista.
2. Evidencia científica actual.
3. Principios fundacionales de FORJA.
4. Decisiones registradas en el repositorio.
5. Instrucción concreta de la tarea.
6. Preferencias de formato.
