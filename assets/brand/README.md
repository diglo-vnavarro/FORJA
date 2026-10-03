# FORJA Brand Assets

El manual de marca (v1.1, aprobado) está en
[`manual/`](manual/README.md). Los PNG, el favicon y los iconos de aplicación
están en [`kit/`](kit/README.md).

Los SVG de esta carpeta son copias de consumo estático de los masters oficiales
incluidos en `src/design-system/forja/brand/`. Esa carpeta del sistema de diseño
es la fuente canónica; estas copias deben mantenerse idénticas y no editarse de
forma independiente.

## Symbol

[`forja-symbol.svg`](master/forja-symbol.svg) contiene el escudo FJ compacto.
Es la variante preferida cuando el espacio es reducido.

## Wordmark

[`forja-wordmark.svg`](master/forja-wordmark.svg) contiene FORJA como geometría
vectorial independiente de fuentes externas. La versión v2 sustituye el trazado
escalonado de v1 por rectas y curvas con la misma geometría
([D-007](../../docs/00-project/decisions.md)).

## Horizontal lockup

[`forja-lockup-horizontal.svg`](master/forja-lockup-horizontal.svg) compone
`[FJ] FORJA` mediante copias exactas de los paths de símbolo y wordmark para
que el archivo sea autónomo en navegadores. No mantiene geometrías alternativas
ni bitmaps; la coincidencia se valida antes de publicar. Su `viewBox`
(`0 12 868 144`) se ajusta al contenido, sin aire a la derecha
([D-008](../../docs/00-project/decisions.md)). Se compone automáticamente con
[`kit/generar-kit.cjs`](kit/generar-kit.cjs).

## Usage

- símbolo FJ: espacios compactos e identificación secundaria;
- lockup horizontal: cabeceras, documentos e interfaces;
- wordmark: usos editoriales donde el símbolo ya esté presente.

Las variantes dark-on-light, light-on-dark y monochrome se resuelven mediante
`currentColor`; no requieren duplicar SVG.

## Meaning

El escudo representa la protección y el bienestar del deportista; FJ son las
iniciales de FORJA ([D-010](../../docs/00-project/decisions.md)). No se
atribuyen otros significados a la geometría.

## Descriptor

FORJA no usa claim. Donde haga falta acompañar a la marca con texto se usa el
descriptor «Sistema de conocimiento para el desarrollo físico de jóvenes
deportistas» ([D-012](../../docs/00-project/decisions.md)).

## Clothing

El símbolo FJ es la variante preferida para camisetas. Debe ser discreto,
legible, estable y no protagonista. No se utilizará el wordmark completo en la
camiseta salvo una decisión posterior explícita.

## Minimum size

Medidas aprobadas ([D-013](../../docs/00-project/decisions.md)):

- símbolo digital: no menos de 20 px de alto;
- lockup digital: no menos de 96 px de ancho;
- símbolo en ropa, serigrafía o vinilo: no menos de 20 mm de alto;
- símbolo en ropa, bordado: no menos de 25 mm de alto.

El hueco más estrecho del símbolo mide el 11 % de su altura (unos 2,2 mm a
20 mm). Antes de la primera producción de cada técnica se valida una muestra
física; si la muestra no reproduce bien los huecos, se sube el mínimo y se
registra el cambio.

## Clear space

Mantener alrededor de la marca un espacio libre mínimo equivalente al ancho
del asta vertical interior de la F. No colocar texto, bordes ni otros símbolos
dentro de esa zona.

## Backgrounds

Usar color oscuro sobre fondo claro y color claro sobre fondo oscuro.
Comprobar contraste y legibilidad antes de publicar. Los tokens oficiales se
definen en `src/design-system/forja/src/styles/forja-tokens.css` y se resumen
en [`tokens.md`](tokens.md).

## Prohibited modifications

No:

- deformar;
- rotar;
- añadir sombras;
- aplicar gradientes arbitrarios;
- alterar proporciones;
- redibujar FJ;
- cambiar la separación FJ/FORJA;
- reconstruir desde screenshots, infografías o raster;
- incorporar fuentes propietarias.

Los PNG transparentes se derivan de los masters con
[`kit/generar-kit.cjs`](kit/generar-kit.cjs). No deben generarse nuevos masters
raster a partir de capturas. El estado completo se registra en el
[manifest de activos](../manifest.md).

## Typography

La aplicación y las piezas generadas desde ella usan Inter (variable, servida
localmente) mediante el token `--forja-font-sans`
([D-006](../../docs/00-project/decisions.md)).
