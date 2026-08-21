# FORJA Exercise Visual Standard

## Propósito

Especificación maestra para producir imágenes de ejercicios FORJA. EX-002 — Sentadilla goblet es la referencia aprobada de composición, formato y atleta, con un master de 1536 × 1024 px. La prioridad de aceptación es siempre:

1. posición corporal y relación con el equipamiento técnicamente plausibles;
2. lectura inequívoca del ejercicio;
3. coherencia visual y estética.

Una imagen atractiva pero técnicamente incorrecta no es válida.

## Referencia EX-002

El master aprobado utiliza un canvas horizontal 3:2, dos fases separadas, atleta juvenil completo en orientación lateral/tres cuartos, fondo blanco neutro sin escenario, vestuario deportivo oscuro, calzado visible, iluminación suave y tratamiento de ilustración digital realista. El atleta presenta una complexión moderadamente atlética, ligera y no culturista. El equipo es funcional y las sombras de contacto anclan al atleta al suelo. Existe aire alrededor de cada figura y no hay texto ni anotaciones.

El emblema visible en la camiseta de la referencia no autoriza a generarlo de nuevo. La nueva producción debe usar prendas sin logos. Cualquier marca FORJA se incorporará después con el asset canónico.

## FIXED y PER_EXERCISE

| FIXED | PER_EXERCISE |
| --- | --- |
| Canvas 3:2 horizontal y master recomendado de 1536 × 1024 px | Dos fases —inicio y fin— por defecto; una tercera solo con justificación técnica imprescindible |
| Fondo blanco neutro, limpio y sin localización | Distribución de las fases dentro del safe area |
| Ilustración digital realista, limpia y de alto detalle | Orientación lateral o tres cuartos indicada por el brief |
| La identidad exacta del FORJA Athlete Master de EX-002 | Posición corporal y rango respaldados por la ficha |
| Mismo rostro, cabello, edad aparente, complexión, proporciones y tono de piel | Ejercicio, postura, fase y orientación necesaria |
| Camiseta gris grafito, pantalón corto negro, calcetines blancos y zapatillas negras | Equipamiento exacto y su posición |
| Luz principal suave desde arriba y frontal-lateral; sombras de contacto discretas | Escala del atleta cuando el ejercicio sea vertical u horizontal |
| Sin texto, flechas, métricas, anotaciones, logos ni marcas comerciales | Cantidad de aire necesaria para mostrar apoyo, anclaje o recorrido |
| Cámara de apariencia natural, sin gran angular ni deformación | Altura de cámara ajustada para hacer visibles las articulaciones clave |

## Canvas

- **Aspect ratio:** 3:2 horizontal.
- **Resolución master recomendada:** 1536 × 1024 px, igual que EX-002. Si la herramienta genera a mayor resolución, conservar el original y derivar esta versión sin reencuadrar.
- **Safe area:** mantener anatomía y equipo esencial dentro del 88 % central del canvas. Margen mínimo orientativo: 6 % por cada lado, aproximadamente 92 px horizontales y 61 px verticales a 1536 × 1024.
- **Márgenes:** ninguna cabeza, mano, pie, mancuerna o apoyo funcional puede tocar el borde. El margen inferior debe incluir la sombra de contacto completa.
- **Posición general:** centrar el conjunto visual, no necesariamente cada pose. Las fases deben leerse de izquierda a derecha y permanecer claramente separadas.
- **Número de posturas:** usar dos posturas —inicio y fin— siempre que sean suficientes para explicar el ejercicio. No añadir una tercera postura para repetir o casi repetir la posición inicial.
- **Excepción:** una tercera postura solo es válida cuando aporta información técnica imprescindible que no puede comunicarse con inicio y fin. La excepción debe quedar justificada expresamente en la especificación de producción.
- **Escala:** en ejercicios de pie, la figura debe ocupar aproximadamente 72–84 % de la altura útil. En ejercicios horizontales, el cuerpo completo debe ocupar aproximadamente 68–82 % del ancho útil.
- **Espacio permitido:** puede aumentarse el aire para incluir un soporte o mostrar el recorrido, pero no para introducir decoración.

## Background

- Blanco neutro o gris casi blanco uniforme, coherente con EX-002; evitar fondos crema o beige.
- Sin textura reconocible; solo puede existir una variación tonal muy sutil que evite apariencia de recorte.
- Contraste suficiente para separar ropa, cabello, calzado y equipo.
- Sombras suaves de contacto bajo pies, cuerpo o material; nunca sombras teatrales.
- Prohibidos gimnasios, paredes con instalaciones, ventanas, espejos, carteles, público, mobiliario decorativo y material ajeno al ejercicio.

## FORJA ATHLETE MASTER

**ATHLETE CONSISTENCY = MANDATORY.**

La imagen aprobada de EX-002 — Sentadilla goblet es la referencia visual principal y obligatoria del `FORJA ATHLETE MASTER`. Toda nueva imagen de la biblioteca debe representar al mismo atleta, no un arquetipo parecido ni una reinterpretación.

Deben coincidir con EX-002:

- identidad y rasgos faciales;
- cabello, corte, color y volumen;
- edad aparente;
- complexión juvenil, ligera y moderadamente atlética, sin hipertrofia de culturista;
- proporciones corporales;
- tono de piel;
- camiseta gris grafito;
- pantalón corto negro;
- calcetines blancos;
- zapatillas negras;
- lenguaje de iluminación;
- tratamiento de ilustración digital realista.

No debe generarse un atleta nuevo para cada ejercicio. La identidad se mantiene también cuando cambian la orientación, el gesto o la visibilidad parcial del rostro. Entre fases de un mismo master la coincidencia debe ser total.

Las únicas diferencias permitidas entre imágenes son:

- ejercicio;
- postura;
- fase;
- orientación técnicamente necesaria;
- equipamiento documentado;
- encuadre cuando resulte técnicamente necesario.

El atleta mantiene una apariencia deportiva coherente con EX-002. Ninguna prenda o calzado debe incorporar logos, letras, escudos o marcas generadas. La anatomía debe seguir siendo realista y proporcionada; manos, dedos, pies y articulaciones deben ser legibles. La consistencia de identidad no autoriza a imponer una geometría corporal universal cuando la ficha admite variabilidad.

Una imagen técnicamente correcta pero con una identidad, complexión, proporciones, cabello, edad aparente, vestuario o calzado visualmente diferentes no puede recibir `APPROVED`: debe clasificarse como `REGENERATE`.

## FORJA branding

El único símbolo permitido es el master canónico:

`src/design-system/forja/brand/forja-symbol.svg`

- Nunca se recreará, reinterpretará ni aproximará mediante generación.
- Ningún prompt debe solicitar la palabra «FORJA», su símbolo o un emblema similar.
- Si el pipeline no garantiza fidelidad vectorial exacta, la generación debe salir completamente sin marca.
- Si una pieza final requiere branding, se añadirá posteriormente como overlay mediante el SVG oficial, respetando su geometría y las reglas del Design System.
- El master sin marca se conserva como base reutilizable.

## Equipment

- Representar exactamente el tipo y número de implementos definidos en la especificación del ejercicio.
- Tamaño, masa aparente, agarre y contacto deben ser físicamente plausibles.
- El equipo funcional debe quedar completo y claramente relacionado con el atleta.
- No añadir discos, bancos, barras, racks, esterillas u otros elementos decorativos no solicitados.
- El equipamiento será neutro y sin marcas comerciales.

## Camera

- Altura aproximada entre cadera y parte inferior del pecho del atleta para movimientos de pie; altura cercana al tronco para tareas en suelo.
- Perspectiva lateral o tres cuartos leve. Evitar vistas frontales cerradas que oculten el patrón.
- Distancia suficiente para mostrar cuerpo y equipo completos con margen.
- Apariencia equivalente a una lente normal o tele corto, aproximadamente 50–70 mm en formato completo.
- Cámara nivelada, sin inclinación dramática.
- Evitar gran angular, perspectiva extrema, escorzo que oculte articulaciones y distorsión de manos, pies o cargas.

## Lighting

- Luz principal amplia y suave desde arriba y frontal-lateral.
- Relleno uniforme para conservar detalle en ropa oscura y articulaciones.
- Contraste medio, sin negros empastados ni altas luces quemadas.
- Sombras suaves, cortas y físicamente coherentes.
- Temperatura neutra o ligeramente cálida, constante en la serie.

## Technical accuracy

- La postura seleccionada debe estar respaldada por la ficha y el brief.
- El patrón principal debe reconocerse sin texto auxiliar.
- Todos los apoyos, agarres y contactos con material deben ser plausibles.
- Las articulaciones relevantes deben quedar visibles; una composición que las oculta no sirve aunque sea estética.
- Las fases deben mostrar al mismo atleta y no contradecirse en orientación, proporciones o equipamiento.
- Una secuencia de tres posturas sin una aportación técnica imprescindible, o cuya última postura repita o casi repita la inicial, debe clasificarse como `REGENERATE`.
- El atleta debe coincidir con el FORJA Athlete Master de EX-002 en todos los criterios obligatorios de identidad y apariencia.
- Los rangos representan una ejecución controlada apropiada, no un máximo universal.
- La revisión humana mediante `IMAGE-QA-CHECKLIST.md` es obligatoria antes de integrar el activo.

## MASTER IMAGE vs INFOGRAPHIC

### MASTER IMAGE

Representa visualmente el ejercicio. No contiene títulos, métricas, instrucciones, flechas, líneas, anotaciones, números ni textos. Su composición debe funcionar como materia prima reutilizable.

### INFOGRAPHIC

Derivado posterior que puede combinar:

- master image aprobado;
- datos del modelo `Exercise`;
- `ForjaIcon`;
- tokens FORJA;
- tipografía de la aplicación.

La generación visual no debe intentar producir directamente la infografía.

## SESSION CARD

Derivado futuro para consulta rápida durante una sesión. Se compondrá con datos `Exercise`, master image aprobado y FORJA Design System. Debe priorizar identificación, variante, dosis contextual y consignas seleccionadas. No se produce en este piloto.

## Naming convention

- Master: `ex-<id>-<slug>-master.webp`
- Infografía: `ex-<id>-<slug>-infographic.webp`
- Ficha de sesión: `ex-<id>-<slug>-session-card.webp`
- Miniatura: `ex-<id>-<slug>-thumbnail.webp`

El ID usa tres dígitos en minúsculas dentro del nombre de archivo. Ejemplos: `ex-001-assisted-squat-master.webp`, `ex-004-dumbbell-rdl-master.webp` y `ex-013-front-plank-master.webp`.

## Conservación y derivados

- `source/`: original de mayor resolución entregado por el pipeline, cuando exista. Se conserva sin compresión destructiva adicional y no se importa directamente en la aplicación.
- `master/`: master aprobado y normalizado a 1536 × 1024 para archivo e integración.
- `web/`: derivados compuestos u optimizados, incluida la infografía.
- `thumbnail`: derivado optimizado nombrado `*-thumbnail.webp`; puede residir en `web/` para evitar una carpeta adicional.
- `session/`: futuras fichas de sesión.

Nunca sobrescribir el original de `source/` con una versión comprimida. La ausencia de original externo no obliga a crear una carpeta vacía.

## Forbidden

- texto generado dentro de la imagen;
- logos generados, escudos aproximados o la palabra FORJA;
- marcas comerciales;
- equipamiento incorrecto o decorativo;
- extremidades adicionales o ausentes;
- manos, dedos, pies o rostros deformados;
- pesos flotantes, agarres imposibles o cargas físicamente incoherentes;
- posiciones anatómicas imposibles;
- fondos de gimnasio aleatorios;
- elementos decorativos innecesarios;
- recortes accidentales de articulaciones o equipo;
- flechas, métricas, líneas de alineación y anotaciones;
- iluminación dramática, profundidad de campo intensa o desenfoque que reduzca la lectura técnica.
