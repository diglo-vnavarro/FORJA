# Kit de marca FORJA

Piezas derivadas de los masters de `src/design-system/forja/brand/`. Ninguna se
dibuja a mano: el generador colorea los SVG oficiales con los tokens y los
rasteriza. Decisiones: [D-008 y D-009](../../../docs/00-project/decisions.md).

## Qué usar para qué

| Necesidad | Archivo |
|---|---|
| Documento, presentación u Office sobre fondo claro | `png/forja-lockup-navy.png` |
| Sobre fondo oscuro o fotografía | `png/forja-lockup-blanco.png` |
| Una sola tinta o terceros | `png/forja-lockup-negro.png` |
| Espacio reducido | `png/forja-simbolo-{navy,blanco,negro}.png` |
| Uso editorial con el símbolo ya presente | `png/forja-wordmark-{navy,blanco,negro}.png` |
| Perfil en redes | `png/forja-avatar-800.png` |
| Pestaña del navegador | `public/favicon.svg` (navy en claro, blanco en oscuro) y `public/favicon-32.png` |
| Pantalla de inicio (iOS) | `public/apple-touch-icon.png` |
| Instalación como aplicación | `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png` y `public/manifest.webmanifest` |
| Enlace compartido | `public/og-image.png` (1200 × 630) |

Los PNG de `png/` son transparentes y miden 2400 px en su lado mayor. Para
impresión, rotulación o bordado se entregan los SVG de
[`../master/`](../master/).

## Cómo se regenera

```bash
node assets/brand/kit/generar-kit.cjs
```

El generador:

- compone `forja-lockup-horizontal.svg` con copias exactas de los paths del
  símbolo y del wordmark;
- sincroniza las copias de `assets/brand/master/`;
- escribe favicon, iconos, manifiesto e imagen para compartir en `public/`;
- escribe los PNG de `png/`.

Requisitos:

- `npm install`, para tener la fuente Inter;
- Playwright con Chromium. Si no está en `node_modules`, se indica su ruta con
  `PLAYWRIGHT_PATH`.

Pendiente: la etiqueta `og:image` usa una ruta relativa (`/og-image.png`).
Cuando exista un dominio público, debe cambiarse por la URL absoluta para que
las redes sociales muestren la imagen.
