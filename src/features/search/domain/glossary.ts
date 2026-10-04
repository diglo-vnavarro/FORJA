export type GlossaryTerm = {
  id: string;
  slug: string;
  title: string;
  acronym?: string;
  category: string;
  summary: string;
  definition: string;
  decision?: string;
  seeAlso: string[];
  source?: string;
};

export type GlossaryParseResult = {
  terms: GlossaryTerm[];
  problems: string[];
};

export function slugifyTerm(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function parseGlossaryMarkdown(rawMarkdown: string): GlossaryParseResult {
  const problems: string[] = [];
  const terms: GlossaryTerm[] = [];

  const lines = rawMarkdown.split(/\r?\n/);
  let currentCategory = "General";
  let currentTitle: string | null = null;
  let currentLines: string[] = [];

  const flushTerm = () => {
    if (!currentTitle) return;

    const fullContent = currentLines.join("\n").trim();
    if (!fullContent) {
      problems.push(`El término "${currentTitle}" no tiene contenido definido.`);
      return;
    }

    const paragraphs = fullContent
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    let summary = "";
    let decision: string | undefined;
    let source: string | undefined;
    const seeAlso: string[] = [];

    for (const para of paragraphs) {
      if (para.startsWith("Decisión FORJA:")) {
        decision = para.replace(/^Decisión FORJA:\s*/, "").trim();
      } else if (para.startsWith("Véase también:")) {
        const links = para.replace(/^Véase también:\s*/, "");
        const matches = [...links.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
        for (const match of matches) {
          seeAlso.push(match[1].trim());
        }
      } else if (para.startsWith("Fuente:")) {
        source = para.replace(/^Fuente:\s*/, "").trim();
      } else if (!summary) {
        summary = para;
      }
    }

    let acronym: string | undefined;
    const dashMatch = currentTitle.match(/^([A-Z0-9/+-]+)\s*—\s*(.+)$/i);
    if (dashMatch) {
      acronym = dashMatch[1].trim();
    }

    const slug = slugifyTerm(currentTitle);

    terms.push({
      id: `glossary-${slug}`,
      slug,
      title: currentTitle,
      acronym,
      category: currentCategory,
      summary,
      definition: fullContent,
      decision,
      seeAlso,
      source,
    });

    currentTitle = null;
    currentLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      flushTerm();
      const cat = line.replace(/^##\s+/, "").trim();
      if (cat.toLowerCase().includes("términos pendientes")) {
        // Ignorar la sección de términos pendientes de definición para el catálogo de términos válidos
        currentCategory = "Pendientes";
        break; // Todos los términos definidos ya pasaron
      } else if (cat.toLowerCase() !== "estado") {
        currentCategory = cat;
      }
      continue;
    }

    if (line.startsWith("### ")) {
      flushTerm();
      currentTitle = line.replace(/^###\s+/, "").trim();
      continue;
    }

    if (currentTitle) {
      currentLines.push(line);
    }
  }

  flushTerm();

  return { terms, problems };
}
