// Genera el kit de marca FORJA a partir de los masters canónicos (decisiones D-008 y D-009).
// Uso: node assets/brand/kit/generar-kit.cjs
//
// - Compone el lockup horizontal con copias exactas de los paths del símbolo y del wordmark,
//   con el viewBox ajustado a su contenido (0 12 868 144).
// - Escribe favicon, iconos de aplicación, manifiesto e imagen para compartir en public/.
// - Escribe PNG transparentes de símbolo, wordmark y lockup en assets/brand/kit/png/.
// Ninguna pieza se redibuja: todas son los masters SVG coloreados mediante currentColor.
//
// Requiere Playwright con Chromium (o PLAYWRIGHT_PATH) y `npm install` para la fuente Inter.
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..', '..', '..');
const candidatos = [
  process.env.PLAYWRIGHT_PATH,
  path.join(RAIZ, 'node_modules', 'playwright'),
  path.join(RAIZ, 'node_modules', '@playwright', 'test'),
].filter(Boolean);
const pw = candidatos.find((p) => fs.existsSync(p));
if (!pw) {
  console.error('No se encuentra Playwright. Instálalo o define PLAYWRIGHT_PATH.');
  process.exit(1);
}
const { chromium } = require(pw);

const BRAND = path.join(RAIZ, 'src', 'design-system', 'forja', 'brand');
const COPIAS = path.join(RAIZ, 'assets', 'brand', 'master');
const PUBLIC = path.join(RAIZ, 'public');
const PNG = path.join(__dirname, 'png');
const escribir = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s.replace(/\r\n/g, '\n'), 'utf8'); };

const css = fs.readFileSync(path.join(RAIZ, 'src', 'design-system', 'forja', 'src', 'styles', 'forja-tokens.css'), 'utf8');
const tok = (n) => css.match(new RegExp(`--forja-${n}:\\s*(#[0-9A-Fa-f]{6})`))[1];
const NAVY = tok('navy');
const WHITE = tok('white');

// ---------------------------------------------------------------- lockup
const leer = (f) => fs.readFileSync(path.join(BRAND, f), 'utf8');
const pathDe = (svg) => svg.match(/<path[\s\S]*?\/>/)[0];
const simbolo = leer('forja-symbol.svg');
const wordmark = leer('forja-wordmark.svg');
const lockup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 12 868 144" role="img" aria-label="FORJA">
<title>FORJA horizontal lockup</title>
<g color="currentColor">
  <svg x="0" y="12" width="120" height="144" viewBox="0 0 109 131" overflow="visible">${pathDe(simbolo)}</svg>
  <svg x="145" y="25" width="800" height="130" viewBox="0 0 1502 271" preserveAspectRatio="xMinYMid meet" overflow="visible">${pathDe(wordmark)}</svg>
</g>
</svg>
`;
escribir(path.join(BRAND, 'forja-lockup-horizontal.svg'), lockup);
for (const f of ['forja-symbol.svg', 'forja-wordmark.svg', 'forja-lockup-horizontal.svg']) {
  fs.copyFileSync(path.join(BRAND, f), path.join(COPIAS, f));
}

// ---------------------------------------------------------------- favicon (navy en pestaña clara, blanco en oscura)
const pathSimbolo = pathDe(simbolo).replace('fill="currentColor"', '');
escribir(path.join(PUBLIC, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 109 131">
<style>path{fill:${NAVY}}@media (prefers-color-scheme:dark){path{fill:${WHITE}}}</style>
${pathSimbolo}
</svg>
`);

escribir(path.join(PUBLIC, 'manifest.webmanifest'), JSON.stringify({
  name: 'FORJA',
  short_name: 'FORJA',
  description: 'Sistema de conocimiento para el desarrollo físico de jóvenes deportistas.',
  lang: 'es',
  start_url: '/',
  display: 'standalone',
  background_color: NAVY,
  theme_color: NAVY,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2) + '\n');

// ---------------------------------------------------------------- piezas raster
const FUENTE = path.join(RAIZ, 'node_modules', '@fontsource-variable', 'inter', 'files');
const fuente = fs.existsSync(FUENTE) ? ['latin', 'latin-ext'].map((s) => `@font-face{font-family:"Inter Variable";font-weight:100 900;font-style:normal;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(FUENTE, `inter-${s}-wght-normal.woff2`)).toString('base64')}) format("woff2")}`).join('') : '';
const conTamano = (svg, w, h) => svg.replace(/<title>[^<]*<\/title>/, '').replace('<svg ', `<svg width="${w}" height="${h}" `);
const caja = (svg) => svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);

// Cada pieza: lienzo, fondo y el SVG centrado con una altura dada.
const piezas = [];
const pieza = (archivo, ancho, alto, fondo, color, svg, altura, extra = '', radio = 0) => piezas.push({ archivo, ancho, alto, fondo, color, svg, altura, extra, radio });

// Iconos de app (símbolo blanco sobre navy)
pieza(path.join(PUBLIC, 'favicon-32.png'), 32, 32, 'transparent', NAVY, simbolo, 30);
pieza(path.join(PUBLIC, 'apple-touch-icon.png'), 180, 180, NAVY, WHITE, simbolo, 112);
pieza(path.join(PUBLIC, 'icon-192.png'), 192, 192, NAVY, WHITE, simbolo, 120, '', 42);
pieza(path.join(PUBLIC, 'icon-512.png'), 512, 512, NAVY, WHITE, simbolo, 320, '', 112);
// maskable: el símbolo cabe en el círculo seguro (80 % del lienzo)
pieza(path.join(PUBLIC, 'icon-maskable-512.png'), 512, 512, NAVY, WHITE, simbolo, 272);
// Imagen para compartir (Open Graph): lockup y descriptor de la visión, sin claim
pieza(path.join(PUBLIC, 'og-image.png'), 1200, 630, NAVY, WHITE, lockup, 118,
  '<p style="margin:44px 0 0;font:400 30px/1.35 \'Inter Variable\',Inter,sans-serif;color:rgba(255,255,255,.78);text-align:center;letter-spacing:-.005em">Sistema de conocimiento para el desarrollo físico<br>de jóvenes deportistas</p>');
pieza(path.join(PNG, 'forja-avatar-800.png'), 800, 800, NAVY, WHITE, simbolo, 460);

// PNG transparentes para Office, redes y terceros (2400 px en el lado mayor)
const COLORES = { navy: NAVY, blanco: WHITE, negro: '#000000' };
for (const [nombre, svg] of [['simbolo', simbolo], ['wordmark', wordmark], ['lockup', lockup]]) {
  const [, , vw, vh] = caja(svg);
  const [w, h] = vw >= vh ? [2400, Math.round(2400 * vh / vw)] : [Math.round(2400 * vw / vh), 2400];
  for (const [c, hex] of Object.entries(COLORES)) pieza(path.join(PNG, `forja-${nombre}-${c}.png`), w, h, 'transparent', hex, svg, h);
}

(async () => {
  const navegador = await chromium.launch();
  const p = await navegador.newPage();
  for (const x of piezas) {
    const [, , vw, vh] = caja(x.svg);
    const ancho = (x.altura * vw / vh).toFixed(2);
    await p.setViewportSize({ width: x.ancho, height: x.alto });
    await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${fuente}
      html,body{margin:0;width:${x.ancho}px;height:${x.alto}px;background:transparent;overflow:hidden}
      main{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${x.fondo};color:${x.color};border-radius:${x.radio}px}
      main>svg{display:block;flex:none}</style></head>
      <body><main>${conTamano(x.svg, ancho, x.altura)}${x.extra}</main></body></html>`);
    await p.evaluate(() => document.fonts.ready);
    fs.mkdirSync(path.dirname(x.archivo), { recursive: true });
    await p.screenshot({ path: x.archivo, omitBackground: true });
  }
  await navegador.close();
  console.log(`Lockup, favicon, manifiesto y ${piezas.length} PNG generados.`);
})();
