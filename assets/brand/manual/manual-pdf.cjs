// Genera el Manual de Marca FORJA en PDF, A4 apaisado (v1.0, aprobado).
// Uso: node assets/brand/manual/manual-pdf.cjs
//
// Lee los masters canónicos de src/design-system/forja/brand/ y los tokens de forja-tokens.css:
// lo que se documenta es exactamente lo que usa la aplicación. Los masters no se redibujan;
// solo se colorean mediante currentColor o se transforman en la página de usos incorrectos.
//
// Requiere Playwright con Chromium. Si no está en node_modules, indicar su ruta:
//   PLAYWRIGHT_PATH=/ruta/a/node_modules/playwright node assets/brand/manual/manual-pdf.cjs
const fs = require('fs');
const os = require('os');
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

const VERSION = '1.0';
const FECHA = '3 de octubre de 2026';
const ESTADO = 'Aprobado';
const SALIDA = path.join(__dirname, `FORJA_Manual_de_Marca_v${VERSION}.pdf`);

const furl = (p) => 'file:///' + p.split(path.sep).join('/');
const DS = path.join(RAIZ, 'src', 'design-system', 'forja');
const leer = (f) => fs.readFileSync(path.join(DS, 'brand', f), 'utf8')
  .replace(/<title>[^<]*<\/title>/, '')
  .replace(/role="img" aria-label="[^"]*"/, 'aria-hidden="true"');
const SIMBOLO = leer('forja-symbol.svg');
const WORDMARK = leer('forja-wordmark.svg');
const LOCKUP = leer('forja-lockup-horizontal.svg');
const conAlto = (svg, alto, extra = '') => svg.replace('<svg ', `<svg style="height:${alto};width:auto;display:block" ${extra} `);
const SIM = (h) => conAlto(SIMBOLO, h);
const WM = (h) => conAlto(WORDMARK, h);
const LOCK = (h) => conAlto(LOCKUP, h);
const IMG = (rel) => furl(path.join(RAIZ, rel));
// Wordmark v1 (escalonado), leído del historial para mostrar el antes y el después de D-007.
let WORDMARK_V1 = null;
try {
  WORDMARK_V1 = require('child_process').execSync('git show a8336de:src/design-system/forja/brand/forja-wordmark.svg',
    { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
} catch { /* sin Git: se omite la comparación */ }
// Inter (D-006), incrustada para que el PDF no dependa de las fuentes del sistema.
const FUENTE = path.join(RAIZ, 'node_modules', '@fontsource-variable', 'inter', 'files');
const INTER = ['latin', 'latin-ext'].map((s) => path.join(FUENTE, `inter-${s}-wght-normal.woff2`)).filter((f) => fs.existsSync(f))
  .map((f) => `@font-face{font-family:"Inter Variable";font-weight:100 900;font-style:normal;src:url(data:font/woff2;base64,${fs.readFileSync(f).toString('base64')}) format("woff2")}`).join('');

// ---------------------------------------------------------------- color (desde forja-tokens.css)
const css = fs.readFileSync(path.join(DS, 'src', 'styles', 'forja-tokens.css'), 'utf8');
const tok = (n) => (css.match(new RegExp(`--forja-${n}:\\s*(#[0-9A-Fa-f]{6})`)) || [])[1];
const T = {
  navy: tok('navy'), blue: tok('blue'), dark: tok('gray-dark'), mid: tok('gray-mid'),
  light: tok('gray-light'), green: tok('green'), red: tok('red'), white: tok('white'), warning: tok('ochre'), blueLight: tok('blue-light'),
};
for (const [k, v] of Object.entries(T)) if (!v) throw new Error(`Token no encontrado: ${k}`);
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => {
  const c = rgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ctr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const coma = (n) => n.toFixed(1).replace('.', ',');
const nivel = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA grande' : 'no apto');
const C = (a, b) => `${coma(ctr(a, b))}:1 · ${nivel(ctr(a, b))}`;

const PALETA = [
  { n: 'Navy FORJA', t: '--forja-navy · --forja-primary', hex: T.navy, rol: 'Identidad principal. Logotipo sobre claro, cabecera de la app, fondos de marca.' },
  { n: 'Azul FORJA', t: '--forja-blue · --forja-secondary', hex: T.blue, rol: 'Acento y jerarquía secundaria: identificadores, enlaces, foco.' },
  { n: 'Gris oscuro', t: '--forja-gray-dark', hex: T.dark, rol: 'Texto de lectura.' },
  { n: 'Gris medio', t: '--forja-gray-mid', hex: T.mid, rol: 'Información secundaria, etiquetas.' },
  { n: 'Azul claro', t: '--forja-blue-light', hex: T.blueLight, rol: 'Superficies azul claro: fondos de bloque y resaltes (D-011).' },
  { n: 'Gris claro', t: '--forja-gray-light', hex: T.light, rol: 'Fondos claros, separadores, superficies.' },
  { n: 'Blanco', t: '--forja-white', hex: T.white, rol: 'Fondo de fichas y tarjetas; logotipo sobre navy.' },
];
const ESTADOS = [
  { n: 'Competencia', t: '--forja-success', hex: T.green, rol: 'Estados favorables, criterios de competencia.' },
  { n: 'Modificar tarea', t: '--forja-danger', hex: T.red, rol: 'Avisos y señales para modificar la tarea.' },
  { n: 'Revisión', t: '--forja-warning · --forja-ochre', hex: T.warning, rol: 'Advertencias y revisión contextual.' },
];
// Paleta del concepto inicial (imagen de referencia). D-011: solo se adopta el azul claro.
const CONCEPTO = [['Azul FORJA', '#0B2A4A', T.navy], ['Azul secundario', '#1F5A9D', T.blue], ['Azul claro', '#E6F0FB', null], ['Gris oscuro', '#1A1F26', T.dark], ['Gris claro', '#F2F4F7', T.light]];

// ---------------------------------------------------------------- iconografía (mapa oficial)
const MAPA = JSON.parse(fs.readFileSync(path.join(DS, 'src', 'icons', 'icon-map.json'), 'utf8'));
const TABLER = path.join(RAIZ, 'node_modules', '@tabler', 'icons', 'icons', 'outline');
const custom = fs.readFileSync(path.join(DS, 'src', 'icons', 'ForjaCustomIcons.tsx'), 'utf8');
const icono = (componente) => {
  const abre = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
  if (componente.startsWith('Forja')) {
    const bloque = custom.split(`export function ${componente}(`)[1].split('export function')[0];
    return abre + [...bloque.matchAll(/<path d="([^"]+)"/g)].map((m) => `<path d="${m[1]}"/>`).join('') + '</svg>';
  }
  const archivo = path.join(TABLER, componente.replace(/^Icon/, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase() + '.svg');
  if (!fs.existsSync(archivo)) return null;
  const cuerpo = fs.readFileSync(archivo, 'utf8').replace(/[\s\S]*?<path stroke="none"[^>]*\/>/, '').replace(/<\/svg>[\s\S]*/, '');
  return abre + cuerpo + '</svg>';
};
const faltan = MAPA.filter((m) => !icono(m.component));
if (faltan.length) throw new Error('Faltan SVG de Tabler (¿npm install?): ' + faltan.map((m) => m.component).join(', '));
const ICON = Object.fromEntries(MAPA.map((m) => [m.name, icono(m.component)]));
// Coincidencias que conviene revisar: mismo glifo para dos conceptos o glifo de otro deporte.
const DUDOSOS = {
  dumbbell: 'mismo glifo que Fuerza',
  throw: 'balón de fútbol',
  medicineBall: 'balón de baloncesto',
  jump: 'comba',
  rir: 'indicador «apagado»',
};

// ---------------------------------------------------------------- diagramas del símbolo (unidades del viewBox 109 × 131)
const ROJO = '#d6453b', MUT = '#6B7780';
const pathSimbolo = SIMBOLO.match(/<path[\s\S]*?\/>/)[0];
const cota = (x1, y1, x2, y2, t, tx, ty, anchor = 'middle') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ROJO}" stroke-width=".7"/>` +
  `<text x="${tx}" y="${ty}" font-size="4.6" fill="${ROJO}" text-anchor="${anchor}" font-family="Segoe UI, Arial">${t}</text>`;
const construccion = `<svg viewBox="-30 -22 178 168" class="dg">
  <defs><pattern id="rej" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" fill="none" stroke="#e6ebf1" stroke-width=".35"/></pattern></defs>
  <rect x="-30" y="-22" width="178" height="168" fill="url(#rej)"/>
  <g color="${T.navy}">${pathSimbolo}</g>
  <g stroke="${ROJO}" stroke-width=".45" stroke-dasharray="2 1.6" fill="none">
    <line x1="3" y1="-8" x2="3" y2="140"/><line x1="106" y1="-8" x2="106" y2="140"/>
    <line x1="-24" y1="3" x2="130" y2="3"/><line x1="-24" y1="79" x2="130" y2="79"/><line x1="-24" y1="128" x2="130" y2="128"/>
    <line x1="18" y1="-8" x2="18" y2="140"/><line x1="39" y1="-8" x2="39" y2="140"/>
  </g>
  ${cota(3, -12, 106, -12, '103 · ancho', 54.5, -14.5)}
  ${cota(18, 136, 39, 136, '21 · asta de la F = módulo', 28.5, 143)}
  ${cota(116, 3, 116, 128, '', 0, 0)}
  <text x="118" y="68" font-size="4.6" fill="${ROJO}" font-family="Segoe UI, Arial">125 · alto</text>
  <text x="-28" y="1.5" font-size="4" fill="${MUT}" font-family="Segoe UI, Arial">3</text>
  <text x="118" y="81" font-size="4.6" fill="${MUT}" font-family="Segoe UI, Arial">79 · punta</text>
  <text x="-28" y="12.5" font-size="4.6" fill="${ROJO}" font-family="Segoe UI, Arial">15</text>
  ${cota(-20, 3, -20, 18, '', 0, 0)}
</svg>`;
const MODULO = 21; // asta de la F en unidades del viewBox
const respeto = `<svg viewBox="${-MODULO - 6} ${-MODULO - 6} ${109 + 2 * MODULO + 12} ${131 + 2 * MODULO + 12}" class="dg">
  <rect x="${-MODULO}" y="${-MODULO}" width="${109 + 2 * MODULO}" height="${131 + 2 * MODULO}" fill="rgba(29,90,216,.08)" stroke="${T.blue}" stroke-width=".9" stroke-dasharray="4 3"/>
  <rect x="0" y="0" width="109" height="131" fill="#fff"/>
  <g color="${T.navy}">${pathSimbolo}</g>
  ${[[-MODULO / 2, 65], [109 + MODULO / 2, 65], [54.5, -MODULO / 2], [54.5, 131 + MODULO / 2]].map(([x, y]) =>
    `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="${T.blue}"/>`).join('')}
  <text x="54.5" y="${131 + MODULO + 1}" font-size="5" text-anchor="middle" fill="${T.blue}" font-family="Segoe UI, Arial" dy="-2">x = asta de la F</text>
</svg>`;

// ---------------------------------------------------------------- maquetación
const paginas = [];
const pagina = (titulo, cuerpo, { cab = true, clase = '' } = {}) => {
  const n = paginas.length + 1;
  paginas.push(`<section class="pg ${clase}">${cab ? `<header class="pg-h"><span class="pg-s">${SIM('4.6mm')}</span><span>Manual de marca</span><span class="pg-t">${titulo}</span></header>` : ''}
    <div class="pg-c">${cuerpo}</div>
    ${cab ? `<footer class="pg-f"><span>FORJA · Manual de marca v${VERSION} · ${FECHA} · ${ESTADO}</span><span>__N${n}__</span></footer>` : ''}</section>`);
};
const head = (kick, h1, lead = '') => `<div class="head"><span class="kick">${kick}</span><h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</div>`;
const chip = (t, tipo) => `<span class="chip chip-${tipo}">${t}</span>`;
const aviso = (t) => `<div class="aviso"><b>Por revisar</b>${t}</div>`;

// 0 · Portada
pagina('', `<div class="cover">
  <div class="cv-top"><span>FORJA</span><span>Manual de marca · versión ${VERSION}</span></div>
  <div class="cv-logo">${LOCK('34mm')}</div>
  <p class="cv-claim">Sistema de conocimiento para el desarrollo físico<br>de jóvenes deportistas</p>
  <div class="cv-bot"><span>${FECHA} · ${ESTADO.toLowerCase()}</span><span>Geometría inmutable · color tematizable · iconografía semántica</span></div>
</div>`, { cab: false, clase: 'pg-cover' });

// 1 · Resumen
const tarjetas = [
  [`<div class="mini mini-navy">${SIM('19mm')}</div>`, 'Símbolo FJ', chip('Aprobado', 'ok'), 'Escudo con las iniciales F y J entrelazadas. Pieza preferente en espacios reducidos y en ropa.'],
  [`<div class="mini">${WM('8mm')}</div>`, 'Wordmark', chip('Aprobado · v2', 'ok'), 'FORJA en mayúsculas geométricas, como vector sin fuente. La v2 sustituye los escalones de la v1 por rectas y curvas (D-007).'],
  [`<div class="mini">${LOCK('11mm')}</div>`, 'Lockup horizontal', chip('Aprobado', 'ok'), 'Símbolo + wordmark. Cabeceras, documentos, fichas e interfaz.'],
  [`<div class="mini mini-pal">${[T.navy, T.blue, T.dark, T.light].map((h) => `<i style="background:${h}"></i>`).join('')}</div>`, 'Paleta', chip('Cerrada', 'ok'), 'Tokens de forja-tokens.css, con azul claro de superficie y ocre con nombre propio (D-011).'],
  [`<div class="mini mini-ico">${['strength', 'speed', 'rpe', 'observe'].map((k) => ICON[k]).join('')}</div>`, 'Iconografía', chip('Aprobada', 'ok'), '40 conceptos semánticos sobre Tabler Icons, trazo 1,8, servidos solo mediante ForjaIcon.'],
  [`<div class="mini mini-type">Aa</div>`, 'Tipografía', chip('Aprobada', 'ok'), 'Inter variable, servida desde la propia aplicación, en la app, las fichas y este manual (D-006).'],
];
pagina('Resumen', `${head('Resumen', 'La marca en seis piezas', 'Masters SVG, paleta, iconografía y tipografía de FORJA. Todas las decisiones que recoge este manual están registradas en <code>docs/00-project/decisions.md</code> (D-006 a D-013).')}
<div class="cards6">${tarjetas.map(([m, t, c, d]) => `<div class="card">${m}<h3>${t}</h3>${c}<p>${d}</p></div>`).join('')}</div>
<p class="nota">Fuente canónica: <code>src/design-system/forja/brand/</code> y <code>src/design-system/forja/src/styles/forja-tokens.css</code>. Las copias de <code>assets/brand/master/</code> son idénticas (comprobado byte a byte).</p>`);

// 2 · La idea
pagina('La idea', `${head('01 · La idea', 'Un escudo con las iniciales de FORJA')}
<div class="two">
  <div class="big-sym">${SIM('92mm')}</div>
  <div class="txt">
    <p class="lead">FORJA es un sistema de conocimiento para decidir mejor sobre el desarrollo físico de jóvenes deportistas. La marca tiene que transmitir lo mismo que la metodología: <b>solidez, cuidado y criterio</b>, no espectáculo.</p>
    <h3>Qué significa (D-010)</h3>
    <ul>
      <li><b>El escudo</b> representa la protección y el bienestar del deportista, que en FORJA van por delante del rendimiento inmediato.</li>
      <li><b>F y J</b> son las iniciales de FORJA, encajadas dentro del escudo.</li>
    </ul>
    <p>No se atribuyen a la geometría otros significados.</p>
    <h3>Cómo se usa</h3>
    <ul>
      <li>Principio del sistema visual: <b>geometría inmutable · color tematizable · iconografía semántica</b>.</li>
      <li>Navy y blanco, sin degradados ni efectos.</li>
      <li>En ropa, el símbolo es «discreto, legible, estable y no protagonista».</li>
      <li>Sin claim (D-012). Si hace falta texto: «Sistema de conocimiento para el desarrollo físico de jóvenes deportistas».</li>
    </ul>
  </div>
</div>`);

// 3 · Construcción del símbolo
pagina('Construcción', `${head('02 · Construcción', 'El símbolo, medido sobre su master', 'Valores en unidades del <code>viewBox</code> 109 × 131 de <code>forja-symbol.svg</code>. Son medidas del archivo, no una reinterpretación: la geometría no se modifica.')}
<div class="two two-dg">
  <div class="dgbox">${construccion}</div>
  <div class="facts">
    <div><b>103 × 125</b><span>Caja del escudo, con 3 unidades de margen interno en el archivo.</span></div>
    <div><b>15</b><span>Grosor del contorno del escudo (de 3 a 18).</span></div>
    <div><b>21</b><span>Asta vertical de la F. Es el <b>módulo</b> de la marca: mide el área de respeto.</span></div>
    <div><b>20</b><span>Ancho de la J (de 72 a 92), casi igual al asta de la F: las dos letras pesan lo mismo.</span></div>
    <div><b>79</b><span>Altura a la que los laterales rectos se convierten en la punta curva del escudo.</span></div>
    <div><b>Recorte a 45°</b><span>El brazo de la F se une a la J con un chaflán (92,24 → 76,37): es el único ángulo del símbolo.</span></div>
  </div>
</div>`);

// 4 · Wordmark y lockup
pagina('Wordmark y lockup', `${head('03 · Wordmark y lockup', 'FORJA, en mayúsculas geométricas')}
<div class="two">
  <div>
    <div class="panel">${WM('17mm')}</div>
    <p class="cap"><b>forja-wordmark.svg</b> (v2) · viewBox 1502 × 271 · un solo trazado de rectas y curvas, sin fuente.</p>
    <div class="panel">${LOCK('22mm')}</div>
    <p class="cap"><b>forja-lockup-horizontal.svg</b> · viewBox 868 × 144, ajustado al contenido (D-008). Símbolo de 137 de alto y mayúsculas de 120: las letras miden el 88 % del escudo. Separación ≈ 1,2 módulos.</p>
  </div>
  <div>
    ${WORDMARK_V1 ? `<div class="zooms"><div class="zoom"><img src="__ZOOM1__"><span>v1</span></div><div class="zoom"><img src="__ZOOM__"><span>v2</span></div></div>
    <p class="cap"><b>Detalle de la O a 8×.</b> La v1 se vectorizó desde una imagen y su contorno era una escalera de segmentos de 1 unidad. La v2 conserva la geometría: la desviación máxima es de 1 unidad (0,4 % de la altura de las mayúsculas).</p>` : '<div class="zoom"><img src="__ZOOM__"></div><p class="cap"><b>Detalle de la O a 8×</b> (v2).</p>'}
    <div class="ok-n"><b>Resuelto · D-007</b>La revectorización es reproducible con <code>assets/brand/tools/revectorizar-wordmark.py</code>. El wordmark ya sirve para impresión grande, rotulación y bordado.</div>
  </div>
</div>`);

// 5 · Versiones
const ver = (fondo, color, contenido, t, d) => `<div class="ver"><div class="ver-a" style="background:${fondo};color:${color}">${contenido}</div><h4>${t}</h4><p>${d}</p></div>`;
pagina('Versiones', `${head('04 · Versiones', 'Un solo dibujo, dos colores', 'Las variantes no se duplican: los SVG usan <code>currentColor</code> y toman el color del contexto.')}
<div class="vers">
  ${ver(T.white, T.navy, LOCK('11mm'), 'Principal · navy sobre claro', `Fichas, documentos, interfaz clara. ${C(T.navy, T.white)}.`)}
  ${ver(T.navy, T.white, LOCK('11mm'), 'Inversa · blanco sobre navy', `Cabecera de la app, portadas. ${C(T.white, T.navy)}.`)}
  ${ver('#000', T.white, LOCK('11mm'), 'Monocroma', 'Blanco o negro puros, para una tinta o fondos de terceros.')}
  ${ver(T.white, T.navy, SIM('20mm'), 'Símbolo', 'Espacios reducidos, avatar, ropa, icono de app.')}
  ${ver(T.navy, T.white, SIM('20mm'), 'Símbolo inverso', 'Sobre navy. También en el azul FORJA: ' + C(T.white, T.blue) + '.')}
  ${ver(T.light, T.navy, WM('8mm'), 'Wordmark solo', 'Usos editoriales donde el símbolo ya está presente.')}
</div>
<div class="ok-n"><b>Resuelto · D-008</b><code>ForjaLogo</code> incrusta el SVG en línea: el logotipo toma el navy de <code>--forja-primary</code> y, en la versión inversa, el blanco de <code>--forja-white</code>, sin filtros.</div>`);

// 6 · Color
const sw = (p, grande) => `<div class="sw ${grande ? 'sw-g' : ''}"><div class="sw-c" style="background:${p.hex};${p.hex === T.white ? 'box-shadow:inset 0 0 0 1px #d8dee6' : ''}"><span style="color:${ctr(p.hex, T.white) > ctr(p.hex, T.navy) ? '#fff' : T.navy}">${p.hex.toUpperCase()}</span></div>
  <h4>${p.n}</h4><code>${p.t}</code><p class="rgb">RGB ${rgb(p.hex).join(' ')}</p><p>${p.rol}</p>
  <p class="ctr">${ctr(p.hex, T.white) < 1.5 ? 'Superficie: no se usa para texto' : `Sobre blanco ${C(p.hex, T.white)}`}</p></div>`;
pagina('Color', `${head('05 · Color', 'Navy para la marca, azul para señalar', 'Valores leídos de <code>forja-tokens.css</code>. Contraste calculado con la fórmula WCAG 2.1.')}
<div class="pal">${PALETA.map((p, i) => sw(p, i < 2)).join('')}</div>
<h3 class="sub">Estados de la metodología</h3>
<div class="pal pal-s">${ESTADOS.map((p) => sw(p)).join('')}</div>`);

pagina('Color: decisiones', `${head('05 · Color', 'Una sola paleta (D-011)')}
<p class="lead">El concepto visual inicial (imagen de referencia de EX-002) proponía otra paleta. Se mantienen los tokens, que ya usa toda la aplicación, y del concepto solo se adopta el azul claro de superficie. El resto queda descartado.</p>
<table class="tb"><thead><tr><th>Concepto inicial</th><th></th><th>Token</th><th>Resultado</th></tr></thead><tbody>
${CONCEPTO.map(([n, a, b]) => `<tr><td>${n}</td><td><i class="dot" style="background:${a}"></i><code>${a}</code></td>
<td>${b ? `<i class="dot" style="background:${b}"></i><code>${b}</code>` : `<i class="dot" style="background:${T.blueLight}"></i><code>${T.blueLight}</code>`}</td>
<td>${!b ? 'Adoptado como <code>--forja-blue-light</code>.' : a.toUpperCase() === b.toUpperCase() ? 'Igual.' : `Se mantiene el token (${coma(ctr(b, T.white))}:1 sobre blanco). El tono del concepto queda descartado.`}</td></tr>`).join('')}
</tbody></table>
<div class="two two-s">
  <div class="figura"><img src="${IMG('assets/references/visual/ex-002/extracted/forja_visual_pack_ex002/brand/prototypes/forja-brand-and-session-concept-v1.png')}"><p class="cap">Concepto inicial: referencia generada, no es master. Su claim, «Entrena · Aprende · Progresa», también queda descartado (D-012).</p></div>
  <div class="txt">
    <h3>Reglas de color</h3>
    <ul>
      <li>Los componentes usan las variables de <code>forja-tokens.css</code>; no repiten los valores hexadecimales.</li>
      <li>El navy es la marca. El azul FORJA señala: identificadores, enlaces y foco. No compite con el navy en superficies grandes.</li>
      <li><code>--forja-blue-light</code> es solo para superficies; nunca para texto.</li>
      <li>Verde, rojo y ocre son estados de la metodología: competencia, modificar la tarea y revisión. No se usan como decoración.</li>
      <li>El verde de competencia da 3,3:1 sobre blanco: sirve para títulos e iconos, no para texto pequeño.</li>
    </ul>
  </div>
</div>`);

// 7 · Espacio y tamaño
pagina('Espacio y tamaño', `${head('06 · Espacio y tamaño', 'Un asta de aire por cada lado')}
<div class="two">
  <div class="dgbox dgbox-s">${respeto}</div>
  <div class="txt">
    <h3>Área de respeto</h3>
    <p>Alrededor de la marca queda libre, como mínimo, el ancho del asta vertical de la F (<b>x</b>, 21 unidades: el 19 % del ancho del escudo). Dentro no van textos, bordes ni otros símbolos. Vale para símbolo y lockup.</p>
    <h3>Tamaño mínimo (D-013)</h3>
    <table class="tb tb-s"><tbody>
      <tr><td>Símbolo, pantalla</td><td><b>20 px</b> de alto</td></tr>
      <tr><td>Lockup, pantalla</td><td><b>96 px</b> de ancho</td></tr>
      <tr><td>Símbolo en serigrafía o vinilo</td><td><b>20 mm</b> de alto</td></tr>
      <tr><td>Símbolo bordado</td><td><b>25 mm</b> de alto</td></tr>
    </tbody></table>
    <p class="nota">El hueco más estrecho del símbolo mide el 11 % de su altura (≈ 2,2 mm a 20 mm). Antes de la primera producción de cada técnica se valida una muestra física; si no reproduce bien los huecos, se sube el mínimo y se registra.</p>
    <div class="escala">${[20, 32, 48].map((h) => `<div><span style="color:${T.navy}">${SIM(h + 'px')}</span><small>${h} px</small></div>`).join('')}
      <div><span style="color:${T.navy}">${LOCK('16px')}</span><small>lockup 96 px</small></div></div>
  </div>
</div>`);

// 8 · Tipografía
const pesos = [[400, 'Regular · texto'], [600, 'Semibold · énfasis'], [700, 'Bold · títulos de bloque'], [800, 'ExtraBold · títulos y etiquetas']];
pagina('Tipografía', `${head('07 · Tipografía', 'Inter, en toda la aplicación', 'Decisión D-006. Una sola familia, variable, servida desde la propia aplicación (<code>@fontsource-variable/inter</code>) y no desde un servicio externo.')}
<div class="two">
  <div class="txt">
    <div class="spec">
      <div style="font-size:30pt;font-weight:800;letter-spacing:-.035em;color:${T.navy}">Sentadilla goblet</div>
      <div style="font-size:12pt;font-weight:700;color:${T.navy};margin-top:2mm">Cómo realizarla</div>
      <div style="font-size:10pt;line-height:1.45;color:${T.dark};margin-top:1.5mm">Producir fuerza contra el suelo para volver a la posición inicial.</div>
      <div style="font-size:7pt;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:${T.mid};margin-top:3mm">Variables de prescripción</div>
      <div class="pesos">${pesos.map(([w, t]) => `<div><span style="font-weight:${w}">Aa Ññ 0123</span><small>${t}</small></div>`).join('')}</div>
      <div class="tab"><span>Cifras tabulares</span><b>3 × 8 · 90 s · RIR 2–3</b><b>2 × 12 · 60 s · RIR 3–4</b></div>
    </div>
  </div>
  <div class="txt">
    <h3>Por qué Inter</h3>
    <ul>
      <li>Licencia libre (SIL OFL): se puede incrustar en la app, en las fichas y en PDF.</li>
      <li>Diseñada para pantalla: se lee bien entre 9 y 13 px, el tamaño de etiquetas y tablas.</li>
      <li>Cifras tabulares (<code>font-variant-numeric: tabular-nums</code>) para alinear series, repeticiones y tiempos.</li>
      <li>Cobertura completa del español. Es la fuente que el código ya pedía.</li>
      <li>Neutra: deja el carácter al wordmark, que es un trazado propio y no depende de ninguna fuente.</li>
      <li>Servida en local: sin dependencia de terceros ni envío de datos de los usuarios a otro servicio.</li>
    </ul>
    <h3>Jerarquía</h3>
    <table class="tb tb-s"><tbody>
      <tr><td>Título de página</td><td>34–50 px · 800 · interletra −0,035 em · navy</td></tr>
      <tr><td>Título de bloque</td><td>15–18 px · 700 · navy</td></tr>
      <tr><td>Texto</td><td>12–13 px · 400 · interlineado 1,45 · gris oscuro</td></tr>
      <tr><td>Etiqueta</td><td>9 px · 800 · mayúsculas +0,07 em · gris medio</td></tr>
    </tbody></table>
    <p class="nota">Token: <code>--forja-font-sans: "Inter Variable", Inter, "Segoe UI", Arial, sans-serif</code>.</p>
  </div>
</div>`);

// 9 · Iconografía
pagina('Iconografía', `${head('08 · Iconografía', 'Cuarenta conceptos, un solo trazo', 'Mapa oficial de <code>icon-map.json</code>: base Tabler Icons (MIT) y tres iconos propios FORJA. Rejilla de 24, trazo 1,8, extremos redondeados, <code>currentColor</code>. Solo se usan a través de <code>ForjaIcon</code>.')}
<div class="icons">${MAPA.map((m) => `<div class="ic ${DUDOSOS[m.name] ? 'ic-d' : ''} ${m.source !== 'Tabler Icons' ? 'ic-f' : ''}">${ICON[m.name]}<span>${m.label}</span></div>`).join('')}</div>
<div class="leyenda"><span><i class="lg-f"></i>Icono propio FORJA</span><span><i class="lg-d"></i>Por revisar: ${Object.entries(DUDOSOS).map(([k, v]) => `${MAPA.find((m) => m.name === k).label}: ${v}`).join(' · ')}</span></div>
<p class="nota">Existe además una biblioteca estática heredada en <code>assets/icons/</code> (trazo 1,75, dibujos propios) que solo usan las fichas HTML antiguas. No es la fuente de verdad.</p>`);

// 10 · Ilustración
pagina('Ilustración', `${head('09 · Ilustración de ejercicios', 'El mismo deportista, sin decorado')}
<div class="two two-il">
  <div class="figura"><img src="${IMG('docs/05-exercises/visual-production/qa/FORJA-MASTERS-CONTACT-SHEET.webp')}"><p class="cap">Masters EX-001 a EX-015. Fuente: <code>FORJA-EXERCISE-VISUAL-STANDARD.md</code>.</p></div>
  <div class="txt">
    <h3>Constantes (FORJA ATHLETE MASTER)</h3>
    <ul>
      <li>Mismo joven en todas las fichas: complexión ligera y atlética, sin hipertrofia.</li>
      <li>Camiseta gris grafito, pantalón negro, calcetines blancos, zapatillas negras.</li>
      <li>Ilustración digital realista, luz suave, sombra de contacto.</li>
    </ul>
    <h3>Encuadre</h3>
    <ul>
      <li>3:2 horizontal, 1536 × 1024. Fondo blanco o gris casi blanco, sin gimnasio.</li>
      <li>Dos posturas, inicio y fin, de izquierda a derecha. Una tercera solo si aporta información técnica.</li>
      <li>Cámara a la altura de la cadera, lateral o tres cuartos, sin gran angular.</li>
    </ul>
    <h3>Marca en la ilustración</h3>
    <p>Las imágenes generadas salen <b>sin marca</b>. Si una pieza la necesita, se añade después el SVG oficial como capa. Nunca se pide a un generador que dibuje el símbolo.</p>
  </div>
</div>`);

// 11 · Aplicaciones
pagina('Aplicaciones', `${head('10 · Aplicaciones', 'Fichas y sesiones')}
<div class="apps">
  <div class="figura"><img src="${IMG('assets/exercises/ex-002/web/ex-002-goblet-squat-infographic-v2-1.webp')}"><p class="cap"><b>Ficha web EX-002</b> (infografía v2.1). Identificador en bloque navy, título en mayúsculas navy, cuatro cajas de criterio con su color de estado.</p></div>
  <div class="figura"><img src="${IMG('assets/exercises/ex-002/session/ex-002-goblet-squat-session-card.webp')}"><p class="cap"><b>Tarjeta de sesión EX-002.</b> Versión compacta para imprimir.</p></div>
  <div class="txt">
    <h3>Patrones que ya se repiten</h3>
    <ul>
      <li><b>Identificador como sello:</b> EX-002, SES-001 en bloque navy o azul con texto blanco.</li>
      <li><b>Código de criterio:</b> verde = competencia, rojo = modificar la tarea, ocre = no corregir automáticamente.</li>
      <li><b>Logotipo al pie</b> o en la esquina superior derecha, nunca sobre la ilustración.</li>
      <li><b>Mensaje de cierre</b> que recuerda el contexto: «Los valores se interpretan dentro del objetivo y contexto descritos en la ficha».</li>
    </ul>
    <h3>Ropa</h3>
    <p>Solo el símbolo FJ, en pecho izquierdo o manga, de 20 a 30 mm, en blanco o navy. El wordmark no va en la camiseta salvo decisión posterior.</p>
  </div>
</div>`);

// 12 · Voz
pagina('Voz', `${head('11 · Voz', 'Precisa, tranquila y honesta con la incertidumbre')}
<div class="two">
  <div class="txt">
    <h3>Reglas (de AGENTS.md y la visión)</h3>
    <ul>
      <li>Español claro, preciso y no sensacionalista. Sin emojis en documentación técnica.</li>
      <li>Distinguir siempre <b>evidencia</b>, <b>consenso profesional</b>, <b>decisión metodológica propia</b> e <b>hipótesis</b>.</li>
      <li>Nada de afirmaciones categóricas cuando hay incertidumbre o diferencias individuales.</li>
      <li>Ayudar a razonar, no dictar: «herramientas para razonar, no recetas para copiar».</li>
      <li>Hablar de competencia y calidad antes que de carga y rendimiento.</li>
    </ul>
  </div>
  <div class="voz">
    <div class="si"><b>Así</b><p>«No existe una única progresión obligatoria.»</p><p>«Adapta la carga al deportista. Calidad antes que cantidad.»</p><p>«Los valores se interpretan dentro del objetivo y contexto descritos en la ficha.»</p></div>
    <div class="no"><b>Así no</b><p>«El método definitivo para ganar fuerza en 4 semanas.»</p><p>«A los 12 años, 3 × 10 con el 70 %.»</p><p>«Entrena como un profesional.»</p></div>
    <p class="cap">Los ejemplos «Así» proceden de piezas del repositorio; los de «Así no» son ilustrativos.</p>
  </div>
</div>`);

// 13 · Uso incorrecto
const mal = (estilo, t, extra = '') => `<div class="mal"><div class="mal-a"><div style="color:${T.navy};${estilo}">${extra || LOCK('11mm')}</div><span class="x">×</span></div><p>${t}</p></div>`;
pagina('Uso incorrecto', `${head('12 · Uso incorrecto', 'Lo que no se hace')}
<div class="mals">
  ${mal('transform:scaleX(1.45)', 'Deformar o cambiar proporciones.', `<div style="transform:scaleX(1.45)">${LOCK('6mm')}</div>`)}
  ${mal('transform:rotate(-12deg)', 'Rotar o inclinar.')}
  ${mal('filter:drop-shadow(2mm 2mm 1.5mm rgba(0,0,0,.45))', 'Añadir sombras, biseles o efectos.')}
  ${mal('', 'Aplicar degradados u otros colores fuera de los tokens.', `<div style="background:linear-gradient(90deg,#d6453b,#f0a020);-webkit-mask:url('data:image/svg+xml;utf8,${encodeURIComponent(LOCK('11mm').replace(/style="[^"]*"/, 'fill="#000" color="#000"'))}') center/contain no-repeat;mask:url('data:image/svg+xml;utf8,${encodeURIComponent(LOCK('11mm').replace(/style="[^"]*"/, 'fill="#000" color="#000"'))}') center/contain no-repeat;width:60mm;height:11mm"></div>`)}
  ${mal('', 'Cambiar la separación entre FJ y FORJA o recomponer el lockup.', `<div style="display:flex;align-items:center;gap:12mm;color:${T.navy}">${SIM('11mm')}${WM('7mm')}</div>`)}
  ${mal('filter:blur(.35mm)', 'Reconstruir desde capturas, infografías o imágenes generadas.')}
  ${mal('', 'Poner el logotipo sobre la ilustración o sobre fondos sin contraste.', `<div style="background:${T.blue};padding:3mm 4mm;color:${T.navy}">${LOCK('9mm')}</div>`)}
  ${mal('', 'Usar el wordmark completo en la camiseta.', `<div style="background:#4b5563;padding:4mm 5mm;color:#fff;border-radius:2mm">${WM('6mm')}</div>`)}
</div>`);

// 14 · Kit e implantación
const fila = (estado, pieza, detalle) => `<tr><td>${estado}</td><td><b>${pieza}</b></td><td>${detalle}</td></tr>`;
pagina('Kit', `${head('13 · Kit', 'Qué hay y dónde está', 'Todo se genera desde los masters con <code>node assets/brand/kit/generar-kit.cjs</code> (D-009). Guía de uso en <code>assets/brand/kit/README.md</code>.')}
<div class="two two-kit">
<table class="tb kit"><thead><tr><th>Estado</th><th>Pieza</th><th>Dónde</th></tr></thead><tbody>
${fila(chip('Listo', 'ok'), 'Masters SVG', '<code>src/design-system/forja/brand/</code>; copias idénticas, comprobadas por un test, en <code>assets/brand/master/</code>.')}
${fila(chip('Listo', 'ok'), 'Wordmark v2', 'Sin escalones (D-007).')}
${fila(chip('Listo', 'ok'), 'Logotipo en la app', 'En línea, navy o blanco por token (D-008).')}
${fila(chip('Listo', 'ok'), 'Tipografía', 'Inter variable, local (D-006).')}
${fila(chip('Listo', 'ok'), 'Favicon', '<code>public/favicon.svg</code> (claro y oscuro) y <code>favicon-32.png</code>.')}
${fila(chip('Listo', 'ok'), 'Iconos de app', 'Apple 180, 192, 512, <i>maskable</i> 512 y <code>manifest.webmanifest</code>.')}
${fila(chip('Listo', 'ok'), 'PNG transparentes', '<code>assets/brand/kit/png/</code>: símbolo, wordmark y lockup en navy, blanco y negro (2400 px); avatar de 800.')}
${fila(chip('Listo', 'ok'), 'Imagen para compartir', '<code>public/og-image.png</code>, 1200 × 630, sin claim.')}
${fila(chip('Pendiente', 'rev'), 'URL de og:image', 'Relativa hasta que exista un dominio público.')}
${fila(chip('Pendiente', 'rev'), 'Pruebas físicas', 'Muestra impresa y bordada del símbolo antes de la primera producción (D-013).')}
</tbody></table>
<div class="kitprev">
  <img src="${IMG('public/og-image.png')}" class="kp-og">
  <div class="kp-row"><img src="${IMG('public/icon-512.png')}"><img src="${IMG('public/icon-maskable-512.png')}"><img src="${IMG('public/apple-touch-icon.png')}"><span class="kp-fav">${SIM('9mm')}</span></div>
</div>
</div>`);

// 15 · Decisiones
const D = [
  ['Significado del símbolo', 'D-010', 'El escudo representa la protección y el bienestar del deportista; FJ son las iniciales de FORJA. No se atribuyen otros significados.'],
  ['Paleta', 'D-011', `Se mantienen los tokens (azul ${coma(ctr(T.blue, T.white))}:1 sobre blanco). Se añaden <code>--forja-blue-light</code> (<code>${T.blueLight}</code>) y <code>--forja-ochre</code>. El resto del concepto queda descartado.`],
  ['Claim', 'D-012', 'Sin claim. Descriptor: «Sistema de conocimiento para el desarrollo físico de jóvenes deportistas».'],
  ['Tipografía', 'D-006', 'Inter variable, servida en local, en app, fichas, kit y manual.'],
  ['Wordmark', 'D-007', 'Revectorizado con la misma geometría; desviación máxima de 1 unidad.'],
  ['Color del logotipo en la app', 'D-008', 'SVG en línea con color por token; <code>viewBox</code> del lockup ajustado.'],
  ['Kit mínimo', 'D-009', 'Favicon, iconos de app, manifiesto, <code>og:image</code>, PNG transparentes y avatar.'],
  ['Tamaños mínimos', 'D-013', '20 px (símbolo) y 96 px (lockup) en pantalla; 20 mm en serigrafía o vinilo y 25 mm bordado, con muestra física antes de la primera producción.'],
];
pagina('Decisiones', `${head('Decisiones', 'Ocho decisiones, todas registradas', 'Cada una está en <code>docs/00-project/decisions.md</code>. Cambiar cualquiera exige una decisión nueva y una nueva versión de este manual.')}
<div class="decs">${D.map(([t, e, d], i) => `<div class="dec dec-ok"><span class="num">D${i + 1}</span><div><h4>${t} ${chip(e, 'ok')}</h4><p>${d}</p></div></div>`).join('')}</div>`);

// 16 · Historial
pagina('Historial', `${head('Historial', 'Versiones del manual')}
<table class="tb"><thead><tr><th>Versión</th><th>Fecha</th><th>Estado</th><th>Cambios</th></tr></thead><tbody>
<tr><td><b>1.0</b></td><td>${FECHA}</td><td>Aprobado</td><td>Significado del símbolo (D-010), paleta cerrada (D-011), sin claim (D-012) y tamaños mínimos (D-013). Primera versión aprobada.</td></tr>
<tr><td><b>0.2</b></td><td>${FECHA}</td><td>Borrador</td><td>Wordmark v2 (D-007), logotipo en línea y lockup ajustado (D-008), kit mínimo (D-009) e Inter como tipografía (D-006). Recomendaciones para D1, D2, D3 y D8.</td></tr>
<tr><td><b>0.1</b></td><td>${FECHA}</td><td>Borrador</td><td>Primera recopilación de la identidad existente: masters, construcción medida, paleta y contrastes, iconografía, ilustración, voz, usos incorrectos, estado del kit y decisiones abiertas.</td></tr>
</tbody></table>
<p class="nota" style="margin-top:8mm">Se regenera con <code>node assets/brand/manual/manual-pdf.cjs</code>. El generador lee los masters y los tokens del repositorio: si cambian, el manual cambia con ellos.</p>`);

// ---------------------------------------------------------------- estilos
const CSS = `${INTER}
@page { size: 297mm 210mm; margin: 0 }
* { box-sizing: border-box }
body { margin: 0; font-family: "Inter Variable", Inter, "Segoe UI", Arial, sans-serif; color: ${T.dark}; -webkit-print-color-adjust: exact; print-color-adjust: exact }
.pg { width: 297mm; height: 210mm; position: relative; overflow: hidden; page-break-after: always; padding: 15mm 16mm 13mm; background: #fff }
.pg-h { position: absolute; top: 7mm; left: 16mm; right: 16mm; display: flex; align-items: center; gap: 2.5mm; font-size: 6.5pt; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: ${T.navy}; padding-bottom: 2mm; border-bottom: .3mm solid ${T.light} }
.pg-s { color: ${T.navy} } .pg-t { margin-left: auto; color: ${T.blue} }
.pg-f { position: absolute; bottom: 6mm; left: 16mm; right: 16mm; display: flex; justify-content: space-between; font-size: 6.5pt; color: ${T.mid} }
.pg-c { height: 100% }
.head { margin-bottom: 5mm } .kick { font-size: 7pt; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: ${T.blue} }
h1 { margin: 1mm 0 0; font-size: 22pt; line-height: 1.1; letter-spacing: -.02em; color: ${T.navy} }
.lead { margin: 2mm 0 0; font-size: 9.5pt; line-height: 1.45; max-width: 205mm; color: ${T.dark} }
h3 { margin: 0 0 1.5mm; font-size: 10pt; color: ${T.navy} } h3.sub { margin-top: 5mm }
h4 { margin: 2mm 0 .8mm; font-size: 8.5pt; color: ${T.navy} }
p, li { font-size: 8.5pt; line-height: 1.45 } ul { margin: 0 0 4mm; padding-left: 4.5mm } li { margin-bottom: .8mm }
code { font-family: Consolas, monospace; font-size: .92em; color: ${T.navy}; background: #eef2f7; padding: 0 .8mm; border-radius: .6mm }
.nota { font-size: 7.5pt; color: ${T.mid} } .cap { font-size: 7.5pt; color: ${T.mid}; margin: 1.5mm 0 3mm; line-height: 1.4 }
.tag { font-size: 6.5pt; font-weight: 700; color: ${T.warning}; background: #f7efe3; padding: .4mm 1.5mm; border-radius: 3mm; vertical-align: middle; letter-spacing: .02em }
.chip { display: inline-block; font-size: 6.5pt; font-weight: 800; padding: .6mm 2mm; border-radius: 3mm; letter-spacing: .02em }
.chip-ok { color: #0f6b33; background: #e3f4e9 } .chip-rev { color: ${T.warning}; background: #f7efe3 } .chip-no { color: #a51d1d; background: #fbe6e6 }
.aviso { border-left: 1mm solid ${T.warning}; background: #fbf6ee; padding: 2.5mm 3.5mm; font-size: 7.8pt; line-height: 1.45; margin: 2.5mm 0 }
.aviso > b:first-child { display: block; font-size: 6.5pt; letter-spacing: .1em; text-transform: uppercase; color: ${T.warning}; margin-bottom: .6mm }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; align-items: start }
.two-dg { grid-template-columns: 1.15fr 1fr } .two-s { grid-template-columns: .9fr 1fr; margin-top: 5mm } .two-il { grid-template-columns: 1.35fr 1fr }
.pg-cover { background: ${T.navy}; color: #fff; padding: 0 }
.cover { height: 100%; padding: 14mm 18mm; display: flex; flex-direction: column; background: radial-gradient(120% 90% at 85% 10%, #123a63 0%, ${T.navy} 55%) }
.cv-top, .cv-bot { display: flex; justify-content: space-between; font-size: 6.5pt; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; opacity: .8 }
.cv-logo { margin-top: 52mm; color: #fff } .cv-claim { font-size: 17pt; line-height: 1.3; margin: 12mm 0 0; font-weight: 300 }
.cv-bot { margin-top: auto }
.cards6 { display: grid; grid-template-columns: repeat(6, 1fr); gap: 3.5mm }
.card { border: .3mm solid #dde3ea; border-radius: 2mm; padding: 3mm; min-height: 100mm }
.card h3 { margin: 3mm 0 1.5mm } .card p { font-size: 7.5pt; margin: 2mm 0 0 }
.mini { height: 26mm; border-radius: 1.5mm; background: #f4f6f9; color: ${T.navy}; display: flex; align-items: center; justify-content: center; padding: 2mm }
.mini svg { max-width: 100% } .mini-navy { background: ${T.navy}; color: #fff }
.mini-pal { gap: 1.5mm } .mini-pal i { width: 7mm; height: 16mm; border-radius: 1mm; box-shadow: inset 0 0 0 .2mm #0001 }
.mini-ico { gap: 2.5mm } .mini-ico svg { width: 7mm; height: 7mm }
.mini-type { font-size: 30pt; font-weight: 800; color: ${T.navy}; letter-spacing: -.03em }
.zooms { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm } .zooms .zoom { position: relative } .zooms span { position: absolute; top: 1.5mm; left: 2mm; font-size: 7pt; font-weight: 800; color: ${T.mid} }
.ok-n { border-left: 1mm solid ${T.green}; background: #eef8f1; padding: 2.5mm 3.5mm; font-size: 7.8pt; line-height: 1.45; margin: 2.5mm 0 }
.ok-n > b:first-child { display: block; font-size: 6.5pt; letter-spacing: .1em; text-transform: uppercase; color: #0f6b33; margin-bottom: .6mm }
.pesos { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm 4mm; margin-top: 5mm; color: ${T.navy} } .pesos span { font-size: 15pt; display: block } .pesos small { font-size: 6.8pt; color: ${T.mid} }
.tab { margin-top: 5mm; display: grid; gap: 1mm; color: ${T.navy}; font-variant-numeric: tabular-nums } .tab span { font-size: 6.5pt; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: ${T.mid} } .tab b { font-size: 12pt; font-weight: 600 }
.two-kit { grid-template-columns: 1.25fr 1fr; gap: 8mm }
.kitprev { display: grid; gap: 4mm } .kp-og { width: 100%; border-radius: 2mm } .kp-row { display: flex; gap: 4mm; align-items: center } .kp-row img { width: 22mm; height: 22mm; border-radius: 3mm } .kp-fav { color: ${T.navy}; padding: 2mm; border: .3mm solid #dde3ea; border-radius: 2mm }
.dec-ok .num { background: ${T.green} } .dec h4 .chip { margin-left: 1.5mm; vertical-align: 1px }
.big-sym { color: ${T.navy}; display: flex; justify-content: center; padding-top: 4mm }
.dgbox { border: .3mm solid #dde3ea; border-radius: 2mm; overflow: hidden } .dg { display: block; width: 100%; height: auto }
.dgbox-s { max-width: 95mm; margin: 0 auto }
.facts { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 6mm }
.facts > div > b { display: block; font-size: 14pt; color: ${T.navy} } .facts span { font-size: 7.8pt; line-height: 1.4 }
.panel { border: .3mm solid #dde3ea; border-radius: 2mm; padding: 7mm; color: ${T.navy}; display: flex; justify-content: center }
.zoom { border: .3mm solid #dde3ea; border-radius: 2mm; overflow: hidden; height: 42mm } .zoom img { width: 100%; height: 100%; object-fit: cover }
.vers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm 5mm }
.ver-a { height: 32mm; border-radius: 2mm; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 0 0 .3mm #dde3ea }
.ver h4 { margin-top: 1.8mm } .ver p { margin: 0; font-size: 7.5pt }
.pal { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3mm } .pal-s { grid-template-columns: repeat(7, 1fr) }
.sw-c { height: 22mm; border-radius: 2mm; display: flex; align-items: flex-end; padding: 2mm; font-size: 7.5pt; font-weight: 800; font-family: Consolas, monospace }
.sw-g .sw-c { height: 30mm } .sw h4 { margin: 2mm 0 .5mm } .sw code { font-size: 6.3pt }
.sw p { margin: .8mm 0 0; font-size: 7.2pt } .sw .rgb { color: ${T.mid} } .sw .ctr { font-weight: 700; color: ${T.navy} }
.tb { width: 100%; border-collapse: collapse; font-size: 8pt } .tb th { text-align: left; font-size: 6.5pt; letter-spacing: .1em; text-transform: uppercase; color: ${T.mid}; padding: 1.5mm 2mm; border-bottom: .4mm solid ${T.navy} }
.tb td { padding: 1.8mm 2mm; border-bottom: .3mm solid ${T.light}; vertical-align: top; line-height: 1.4 }
.tb-s td { font-size: 8pt } .dot { display: inline-block; width: 3.2mm; height: 3.2mm; border-radius: 50%; vertical-align: -.6mm; margin-right: 1.5mm; box-shadow: inset 0 0 0 .2mm #0002 }
.figura img { width: 100%; border-radius: 2mm; border: .3mm solid #dde3ea; display: block }
.escala { display: flex; align-items: flex-end; gap: 7mm; margin-top: 5mm } .escala div { display: flex; flex-direction: column; align-items: center; gap: 1.5mm } .escala small { font-size: 6.5pt; color: ${T.mid} }
.spec { border: .3mm solid #dde3ea; border-radius: 2mm; padding: 6mm }
.icons { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2mm }
.ic { border: .3mm solid #e3e8ee; border-radius: 1.5mm; padding: 2.2mm 1mm 1.5mm; text-align: center; color: ${T.navy}; height: 21mm }
.ic svg { width: 8mm; height: 8mm } .ic span { display: block; font-size: 6pt; line-height: 1.2; margin-top: 1mm; color: ${T.dark} }
.ic-f { background: #eef3fd; border-color: ${T.blue} } .ic-d { background: #fbf6ee; border-color: ${T.warning} }
.leyenda { display: flex; gap: 6mm; font-size: 7pt; margin: 3mm 0 1mm; color: ${T.dark} } .leyenda i { display: inline-block; width: 3mm; height: 3mm; border-radius: .6mm; margin-right: 1.2mm; vertical-align: -.5mm }
.lg-f { background: #eef3fd; box-shadow: inset 0 0 0 .3mm ${T.blue} } .lg-d { background: #fbf6ee; box-shadow: inset 0 0 0 .3mm ${T.warning} }
.apps { display: grid; grid-template-columns: .95fr 1.05fr 1fr; gap: 6mm; align-items: start }
.apps .figura img { max-height: 120mm; object-fit: contain; background: #f4f6f9 }
.voz .si, .voz .no { border-radius: 2mm; padding: 4mm 5mm; margin-bottom: 3mm } .voz b { font-size: 7pt; letter-spacing: .12em; text-transform: uppercase }
.voz p { font-size: 10pt; margin: 1.5mm 0 } .si { background: #e9f6ee } .si b { color: #0f6b33 } .no { background: #fbeceb } .no b { color: #a51d1d } .no p { color: #7a4a47 }
.mals { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5mm 6mm }
.mal-a { height: 38mm; border: .3mm solid #dde3ea; border-radius: 2mm; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden }
.mal .x { position: absolute; top: 1.5mm; right: 2.5mm; font-size: 14pt; font-weight: 800; color: #d6453b } .mal p { font-size: 7.8pt; margin: 1.8mm 0 0 }
.kit td:first-child { width: 22mm } .kit td:nth-child(2) { width: 46mm }
.decs { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 8mm }
.dec { display: flex; gap: 4mm; border-top: .3mm solid ${T.light}; padding-top: 3mm }
.num { flex: none; width: 10mm; height: 10mm; border-radius: 50%; background: ${T.navy}; color: #fff; font-weight: 800; font-size: 8pt; display: flex; align-items: center; justify-content: center }
.dec h4 { margin: 0 0 1mm; font-size: 9.5pt } .dec p { margin: 0 }
`;

(async () => {
  const total = paginas.length;
  const zoomTmp = path.join(os.tmpdir(), 'forja-wordmark-zoom.png');
  const zoomTmp1 = path.join(os.tmpdir(), 'forja-wordmark-zoom-v1.png');
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>FORJA · Manual de marca v${VERSION}</title><style>${CSS}</style></head><body>${paginas.join('')
    .replace(/__N(\d+)__/g, (_, n) => `${n} / ${total}`).replace('__ZOOM__', furl(zoomTmp)).replace('__ZOOM1__', furl(zoomTmp1))}</body></html>`;
  const navegador = await chromium.launch();
  const p = await navegador.newPage({ deviceScaleFactor: 2 });
  // Detalle real del wordmark a 8×: se renderiza el propio master, sin retocar.
  await p.setViewportSize({ width: 1440, height: 720 });
  await p.setContent(`<body style="margin:0;background:#fff;color:${T.navy}">${WORDMARK.replace('<svg ', '<svg style="position:absolute;left:-1920px;top:0;width:12016px;height:2168px" ')}</body>`);
  await p.screenshot({ path: zoomTmp, clip: { x: 0, y: 0, width: 1440, height: 720 } });
  if (WORDMARK_V1) {
    await p.setContent(`<body style="margin:0;background:#fff;color:${T.navy}">${WORDMARK_V1.replace('<svg', '<svg style="position:absolute;left:-1920px;top:0;width:12016px;height:2168px"')}</body>`);
    await p.screenshot({ path: zoomTmp1, clip: { x: 0, y: 0, width: 1440, height: 720 } });
  }
  const tmp = path.join(os.tmpdir(), 'forja-manual-marca.html');
  fs.writeFileSync(tmp, html, 'utf8');
  await p.goto(furl(tmp), { waitUntil: 'networkidle' });
  await p.pdf({ path: SALIDA, width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
  if (process.env.FORJA_MANUAL_PNG) {
    const dir = process.env.FORJA_MANUAL_PNG;
    fs.mkdirSync(dir, { recursive: true });
    await p.setViewportSize({ width: 1123, height: 794 });
    const secciones = await p.$$('section.pg');
    for (let i = 0; i < secciones.length; i++) await secciones[i].screenshot({ path: path.join(dir, `p${String(i + 1).padStart(2, '0')}.png`) });
  }
  await navegador.close();
  console.log(`${path.relative(RAIZ, SALIDA)} · ${total} páginas`);
})();
