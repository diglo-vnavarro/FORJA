# Instrucciones para agentes y colaboradores

Este archivo define las reglas que debe respetar cualquier persona o agente de inteligencia artificial que trabaje en FORJA.

## Propósito

FORJA es un sistema de conocimiento y toma de decisiones para el desarrollo físico de jóvenes deportistas.

No es una colección de rutinas ni una aplicación de generación automática de entrenamientos.

## Fuente oficial

La rama `main` contiene únicamente contenido revisado y aceptado.

Las ideas surgidas en conversaciones, borradores externos o respuestas de herramientas de inteligencia artificial no se consideran parte de FORJA hasta quedar incorporadas mediante una pull request.

## Reglas de contenido

1. No inventar referencias científicas.
2. No presentar opiniones metodológicas como hechos demostrados.
3. Diferenciar claramente:
   - evidencia científica;
   - consenso profesional;
   - decisión metodológica propia;
   - hipótesis pendiente de validación.
4. Evitar afirmaciones categóricas cuando existan incertidumbre o diferencias individuales.
5. Priorizar el desarrollo y bienestar a largo plazo sobre el rendimiento inmediato.
6. No prescribir cargas únicamente a partir de la edad cronológica.
7. Mantener la separación entre metodología general y casos personales.
8. Utilizar lenguaje comprensible, preciso y no sensacionalista.
9. No introducir ejercicios sin explicar su propósito, contexto y criterios de aplicación.
10. No modificar el alcance del proyecto sin registrar la decisión.

## Reglas editoriales

- Idioma principal: español.
- Formato principal: Markdown.
- Títulos descriptivos y orientados al contenido.
- Un documento debe poder entenderse sin depender de una conversación externa.
- Evitar repeticiones y frases promocionales.
- Definir los términos técnicos en el glosario.
- Utilizar enlaces relativos entre documentos.
- Mantener líneas razonablemente cortas cuando no perjudique la legibilidad.
- No utilizar emojis en la documentación técnica o científica.

## Reglas de Git

- No trabajar directamente sobre `main`.
- Crear una rama específica para cada cambio.
- Mantener cada pull request enfocada en un único objetivo.
- Usar commits descriptivos.
- No mezclar cambios editoriales, científicos y técnicos sin necesidad.
- Abrir inicialmente las pull requests como draft.
- Revisar enlaces y formato antes de solicitar la integración.

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

## Sistema visual FORJA

Estas reglas se aplican a cualquier interfaz, ficha o activo visual del
repositorio:

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
