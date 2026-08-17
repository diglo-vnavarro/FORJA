# FORJA Brand Assets

Los SVG de esta carpeta son **MASTER CANDIDATE** hasta completar su revisión
visual humana. Se han reconstruido como vectores limpios a partir del concepto
aprobado, sin bitmap embebido, fuentes externas ni efectos raster.

## Symbol

[`forja-symbol.svg`](master/forja-symbol.svg) contiene el escudo FJ compacto.
Es la variante preferida cuando el espacio es reducido.

## Wordmark

[`forja-wordmark.svg`](master/forja-wordmark.svg) contiene FORJA como geometría
vectorial independiente de fuentes externas.

## Horizontal lockup

[`forja-lockup-horizontal.svg`](master/forja-lockup-horizontal.svg) compone
`[FJ] FORJA` mediante copias exactas de los paths de símbolo y wordmark para
que el archivo sea autónomo en navegadores. No mantiene geometrías alternativas
ni bitmaps; la coincidencia se valida antes de publicar.

## Usage

- símbolo FJ: espacios compactos e identificación secundaria;
- lockup horizontal: cabeceras, documentos e interfaces;
- wordmark: usos editoriales donde el símbolo ya esté presente.

Las variantes dark-on-light, light-on-dark y monochrome se resuelven mediante
`currentColor`; no requieren duplicar SVG.

## Clothing

El símbolo FJ es la variante preferida para camisetas. Debe ser discreto,
legible, estable y no protagonista. No se utilizará el wordmark completo en la
camiseta salvo una decisión posterior explícita.

## Minimum size

Hasta completar pruebas de reproducción, usar como orientación provisional:

- símbolo digital: no menos de 20 px de alto;
- lockup digital: no menos de 96 px de ancho;
- símbolo en ropa: aproximadamente 20–30 mm de alto.

Estas medidas requieren validación humana y de producción.

## Clear space

Mantener alrededor de la marca un espacio libre mínimo equivalente al ancho
del asta vertical interior de la F. No colocar texto, bordes ni otros símbolos
dentro de esa zona.

## Backgrounds

Usar color oscuro sobre fondo claro y color claro sobre fondo oscuro.
Comprobar contraste y legibilidad antes de publicar. Los tokens actuales son
[provisionales](tokens.md).

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

Los PNG transparentes permanecen pendientes hasta disponer de una
renderización fiable y revisión visual. El estado completo se registra en el
[manifest de activos](../manifest.md).
