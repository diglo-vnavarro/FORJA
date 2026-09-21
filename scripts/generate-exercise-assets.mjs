import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { once } from "node:events";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createServer as createViteServer } from "vite";

const exerciseIds = process.argv.slice(2).map((value) => value.toUpperCase());
if (!exerciseIds.length || exerciseIds.some((id) => !/^EX-\d{3}$/.test(id))) throw new Error("Usage: npm run generate:exercise-assets -- EX-002 EX-007");

const slugById = { "EX-002": "goblet-squat", "EX-007": "step-up" };
for (const id of exerciseIds) if (!slugById[id]) throw new Error(`${id} is not enabled for derivative export yet.`);

const exports = [
  ...exerciseIds.map((id) => ({ id, format: "infographic-v2-1", width: 1200, height: 1360, output: `assets/exercises/${id.toLowerCase()}/web/${id.toLowerCase()}-${slugById[id]}-infographic-v2-1.webp` })),
  ...(exerciseIds.includes("EX-002") && exerciseIds.includes("EX-007") ? [{ id: "EX-002", format: "infographic-v2-1-comparison", query: "&compare=EX-007", width: 3600, height: 1920, output: "docs/05-exercises/visual-production/qa/EX-002-EX-007-INFOGRAPHIC-V2-1-COMPARISON.webp" }] : []),
];

const browserCandidates = [
  process.env.FORJA_CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].filter(Boolean);
const browserPath = browserCandidates.find(existsSync);
if (!browserPath) throw new Error("Chrome or Edge was not found. Set FORJA_CHROME_PATH.");

const freePort = () => new Promise((accept, reject) => {
  const socket = createServer();
  socket.on("error", reject);
  socket.listen(0, "127.0.0.1", () => { const address = socket.address(); socket.close(() => accept(address.port)); });
});

class CdpClient {
  constructor(url) {
    this.id = 0;
    this.pending = new Map();
    this.socket = new WebSocket(url);
  }
  async open() {
    await new Promise((accept, reject) => { this.socket.addEventListener("open", accept, { once: true }); this.socket.addEventListener("error", reject, { once: true }); });
    this.socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      if (!message.id) return;
      const request = this.pending.get(message.id);
      if (!request) return;
      this.pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message)); else request.accept(message.result);
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((accept, reject) => { this.pending.set(id, { accept, reject }); this.socket.send(JSON.stringify({ id, method, params })); });
  }
  close() { this.socket.close(); }
}

const waitFor = async (fn, timeout = 15000) => {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try { const value = await fn(); if (value) return value; } catch {}
    await new Promise((accept) => setTimeout(accept, 120));
  }
  throw new Error("Timed out waiting for browser export state.");
};

const vite = await createViteServer({ server: { host: "127.0.0.1", port: 0 }, logLevel: "error" });
let chrome;
let profile;
try {
  await vite.listen();
  const vitePort = vite.httpServer.address().port;
  const debugPort = await freePort();
  profile = await mkdtemp(join(tmpdir(), "forja-derivatives-"));
  chrome = spawn(browserPath, ["--headless=new", `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu", "about:blank"], { stdio: "ignore", windowsHide: true });
  const page = await waitFor(async () => {
    const list = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) => response.json());
    return list.find((target) => target.type === "page");
  });
  const cdp = new CdpClient(page.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  for (const { id, format, query = "", width, height, output } of exports) {
    await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
    await cdp.send("Page.navigate", { url: `http://127.0.0.1:${vitePort}/visual-production/${id}?format=${format}${query}` });
    await waitFor(async () => {
      const result = await cdp.send("Runtime.evaluate", { expression: "document.readyState === 'complete' && [...document.images].every((image) => image.complete) && Boolean(document.querySelector('[data-export-root]'))", returnByValue: true });
      return result.result.value;
    });
    await cdp.send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
    const screenshot = await cdp.send("Page.captureScreenshot", { format: "webp", quality: 92, fromSurface: true, captureBeyondViewport: true, clip: { x: 0, y: 0, width, height, scale: 1 } });
    const target = resolve(output);
    await mkdir(resolve(target, ".."), { recursive: true });
    await writeFile(target, Buffer.from(screenshot.data, "base64"));
    console.log(`${id} ${format}: ${output} (${width}x${height})`);
  }
  cdp.close();
} finally {
  if (chrome && chrome.exitCode === null) {
    chrome.kill();
    await Promise.race([once(chrome, "exit"), new Promise((accept) => setTimeout(accept, 2000))]);
  }
  await vite.close();
  if (profile) await rm(profile, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
}
