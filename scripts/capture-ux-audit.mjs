import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";

const distDir = path.resolve("dist");
const screenshotsDir = path.resolve("docs/00-project/screenshots");
fs.mkdirSync(screenshotsDir, { recursive: true });

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

const server = http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0];
  let filePath = path.join(distDir, urlPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, "index.html");
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading file");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

function capture(chromePath, args) {
  return new Promise((resolve) => {
    execFile(chromePath, args, { timeout: 8000 }, (error, stdout, stderr) => {
      resolve();
    });
  });
}

const PORT = 4173;
server.listen(PORT, "127.0.0.1", async () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  const viewports = [
    { suffix: "375", width: 375, height: 812 },
    { suffix: "768", width: 768, height: 1024 },
    { suffix: "1280", width: 1280, height: 800 },
  ];

  const pages = [
    { id: "recorrido-1-01-dashboard", path: "/" },
    { id: "recorrido-1-02-catalogo-ejercicios", path: "/exercises" },
    { id: "recorrido-1-03-detalle-ejercicio-ex002", path: "/exercises/sentadilla-goblet" },
    { id: "recorrido-2-01-catalogo-sesiones", path: "/sessions" },
    { id: "recorrido-2-02-detalle-sesion-ses002", path: "/sessions/ses-002" },
    { id: "recorrido-2-03-constructor-sesion", path: "/builder" },
    { id: "recorrido-3-01-ejecucion-sesion-ses002", path: "/execution?session=ses-002" },
  ];

  for (const page of pages) {
    for (const vp of viewports) {
      const filename = `${page.id}-${vp.suffix}.png`;
      const outFile = path.join(screenshotsDir, filename);
      console.log(`Capturing ${filename} (${vp.width}x${vp.height})...`);
      await capture(chromePath, [
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        "--virtual-time-budget=1200",
        `--window-size=${vp.width},${vp.height}`,
        `--screenshot=${outFile}`,
        `http://127.0.0.1:${PORT}${page.path}`,
      ]);
    }
  }

  console.log("All screenshots captured successfully.");
  server.close(() => {
    process.exit(0);
  });
});
