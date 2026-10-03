// Comprueba los enlaces relativos de la documentación Markdown: que el archivo exista y,
// si el enlace lleva ancla, que el encabezado exista en el destino.
// Uso: npm run check:links   (sale con código 1 si encuentra enlaces rotos)
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(process.argv[2] ?? ".");
const ignored = new Set(["node_modules", ".git", "dist", ".claude"]);

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (path.endsWith(".md")) files.push(path);
  }
})(root);

// Misma regla que GitHub para generar anclas a partir de un encabezado.
const slug = (heading) => heading.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s/g, "-");
const anchorsOf = new Map();
const anchors = (file) => {
  if (!anchorsOf.has(file)) {
    anchorsOf.set(file, new Set(readFileSync(file, "utf8").split(/\r?\n/).filter((line) => /^#+ /.test(line)).map((line) => slug(line.replace(/^#+ /, "")))));
  }
  return anchorsOf.get(file);
};

const problems = [];
let total = 0;
for (const file of files) {
  readFileSync(file, "utf8").split(/\r?\n/).forEach((line, index) => {
    for (const [, target] of line.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^(https?:|mailto:)/.test(target)) continue;
      total += 1;
      const [path, anchor] = target.split("#");
      const destination = path ? resolve(dirname(file), decodeURIComponent(path)) : file;
      const where = `${relative(root, file)}:${index + 1}`;
      if (!existsSync(destination)) problems.push(`${where} enlace roto: ${target}`);
      else if (anchor && destination.endsWith(".md") && !anchors(destination).has(anchor)) problems.push(`${where} ancla inexistente: ${target}`);
    }
  });
}

for (const problem of problems) console.error(problem);
console.log(`${files.length} archivos Markdown, ${total} enlaces relativos, ${problems.length} problemas.`);
process.exit(problems.length ? 1 : 0);
