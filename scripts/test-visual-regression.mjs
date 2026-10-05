import http from "node:http";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9222;

const VIEWPORTS = [
  { width: 375, height: 812, name: "375px (Mobile)" },
  { width: 768, height: 1024, name: "768px (Tablet)" },
  { width: 1280, height: 800, name: "1280px (Desktop)" },
];

const ROUTES = [
  { path: "/", name: "Dashboard" },
  { path: "/exercises", name: "Catálogo de ejercicios" },
  { path: "/exercises/EX-002", name: "Detalle ejercicio (EX-002)" },
  { path: "/sessions", name: "Catálogo de sesiones" },
  { path: "/sessions/SES-001", name: "Detalle sesión (SES-001)" },
  { path: "/sessions/prepare", name: "Constructor de sesión" },
  { path: "/sessions/saved", name: "Sesiones guardadas" },
  { path: "/planning", name: "Programación (Coming Soon)" },
  { path: "/athletes", name: "Atletas (Coming Soon)" },
  { path: "/library", name: "Biblioteca (Coming Soon)" },
  { path: "/404-test", name: "Página no encontrada (404)" },
];

const OUTPUT_DIR = path.resolve("docs/00-project/visual-regression");

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".json": "application/json",
};

function createStaticServer(distDir) {
  return http.createServer((req, res) => {
    const urlPath = req.url.split("?")[0];
    let filePath = path.join(distDir, urlPath);

    if (!fsSync.existsSync(filePath) || fsSync.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, "index.html");
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "application/octet-stream";

    fsSync.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading file");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    });
  });
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.pending = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && this.pending.has(data.id)) {
        const { resolve, reject } = this.pending.get(data.id);
        this.pending.delete(data.id);
        if (data.error) reject(new Error(data.error.message));
        else resolve(data.result);
      }
    };
  }

  send(method, params = {}) {
    const msgId = this.id++;
    return new Promise((resolve, reject) => {
      this.pending.set(msgId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  const distDir = path.resolve("dist");
  if (!fsSync.existsSync(distDir)) {
    console.error("El directorio dist/ no existe. Ejecuta 'npm run build' primero.");
    process.exit(1);
  }

  console.log(`Iniciando servidor local en ${BASE_URL}...`);
  const server = createStaticServer(distDir);
  await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  console.log("Iniciando Chrome en modo headless con CDP...");
  const chromeProcess = spawn(
    CHROME_PATH,
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      `--remote-debugging-port=${CDP_PORT}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  let cdpUrl = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
      if (res.ok) {
        const targets = await res.json();
        const pageTarget = targets.find((t) => t.type === "page");
        if (pageTarget && pageTarget.webSocketDebuggerUrl) {
          cdpUrl = pageTarget.webSocketDebuggerUrl;
          break;
        }
      }
    } catch {
      // espera
    }
    await wait(200);
  }

  if (!cdpUrl) {
    chromeProcess.kill();
    server.close();
    throw new Error("No se pudo obtener el endpoint WebSocket de CDP.");
  }

  const cdp = new CdpClient(cdpUrl);
  await cdp.connect();
  await cdp.send("Page.enable");
  await cdp.send("DOM.enable");

  const results = [];
  let overflowFailures = 0;

  try {
    for (const vp of VIEWPORTS) {
      const vpDir = path.join(OUTPUT_DIR, `${vp.width}`);
      await fs.mkdir(vpDir, { recursive: true });

      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 768,
      });

      for (const route of ROUTES) {
        const url = `${BASE_URL}${route.path}`;
        await cdp.send("Page.navigate", { url });
        await wait(600); // espera renderizado React y fuentes

        // Evaluar overflow horizontal
        const evalRes = await cdp.send("Runtime.evaluate", {
          expression: `(() => {
            const doc = document.documentElement;
            const body = document.body;
            const scrollW = Math.max(doc.scrollWidth, body ? body.scrollWidth : 0);
            const clientW = doc.clientWidth;
            return {
              scrollWidth: scrollW,
              clientWidth: clientW,
              hasOverflow: scrollW > clientW + 1 // 1px margen de subpixel
            };
          })()`,
          returnByValue: true,
        });

        const overflow = evalRes.result.value;
        const slug = route.path.replace(/\//g, "-").replace(/^-/, "") || "root";
        const screenshotPath = path.join(vpDir, `${slug}.png`);

        const shotRes = await cdp.send("Page.captureScreenshot", {
          format: "png",
          captureBeyondViewport: false,
        });

        await fs.writeFile(screenshotPath, Buffer.from(shotRes.data, "base64"));

        const status = overflow.hasOverflow ? "FALLO" : "OK";
        if (overflow.hasOverflow) overflowFailures++;

        results.push({
          viewport: vp.name,
          width: vp.width,
          route: route.name,
          path: route.path,
          status,
          scrollWidth: overflow.scrollWidth,
          clientWidth: overflow.clientWidth,
          screenshot: path.relative(OUTPUT_DIR, screenshotPath).replace(/\\/g, "/"),
        });

        console.log(`[${vp.width}px] ${route.name}: ${status} (${overflow.scrollWidth}px / ${overflow.clientWidth}px)`);
      }
    }
  } finally {
    cdp.close();
    chromeProcess.kill();
    server.close();
  }

  // Generar reporte markdown
  let report = `# Informe de auditoría visual y desbordamiento horizontal (F1-13)\n\n`;
  report += `Fecha: ${new Date().toISOString()}\n\n`;
  report += `## Resumen\n\n`;
  report += `- Total comprobaciones: ${results.length}\n`;
  report += `- Pruebas exitosas (sin desbordamiento horizontal): ${results.length - overflowFailures}\n`;
  report += `- Pruebas fallidas (con desbordamiento horizontal): ${overflowFailures}\n\n`;

  report += `## Detalle por vista y ruta\n\n`;
  report += `| Vista | Ruta | Estado | Scroll Width | Client Width | Captura |\n`;
  report += `| --- | --- | --- | --- | --- | --- |\n`;

  for (const r of results) {
    report += `| ${r.viewport} | \`${r.path}\` (${r.route}) | **${r.status}** | ${r.scrollWidth}px | ${r.clientWidth}px | [Ver](${r.screenshot}) |\n`;
  }

  const reportPath = path.join(OUTPUT_DIR, "visual-regression-report.md");
  await fs.writeFile(reportPath, report, "utf-8");
  console.log(`\nInforme guardado en: ${reportPath}`);

  if (overflowFailures > 0) {
    console.error(`ERROR: Se encontraron ${overflowFailures} rutas con desbordamiento horizontal.`);
    process.exit(1);
  } else {
    console.log(`ÉXITO: Todas las rutas (${results.length}/${results.length}) verificadas sin desbordamiento horizontal en 375, 768 y 1280 px.`);
  }
}

run().catch((err) => {
  console.error("Error ejecutando pruebas visuales:", err);
  process.exit(1);
});
