import type { ExerciseRelation, LabeledContent } from "@/features/exercises/domain/exercise";

const cleanMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\([^)]+\)/g, "$1").replace(/[*_`>]/g, "").replace(/\s+/g, " ").trim();

export function section(markdown: string, ...headings: string[]) {
  for (const heading of headings) {
    const match = markdown.match(new RegExp(`^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\r?\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m"));
    if (match) return match[1].trim();
  }
  return "";
}

export function sectionText(markdown: string, ...headings: string[]) {
  return cleanMarkdown(section(markdown, ...headings).replace(/^### .+$/gm, "").replace(/^---$/gm, " "));
}

export function sectionItems(markdown: string, ...headings: string[]) {
  const raw = section(markdown, ...headings);
  if (!raw) return [];
  const output: string[] = [];
  let subheading = "";
  let paragraph: string[] = [];
  const flush = () => {
    const text = cleanMarkdown(paragraph.join(" "));
    if (text) output.push(subheading && output.length ? `${subheading}: ${text}` : text);
    paragraph = [];
  };
  for (const original of raw.split(/\r?\n/)) {
    const line = original.trim();
    if (!line || line === "---") { flush(); continue; }
    if (line.startsWith("### ")) { flush(); subheading = cleanMarkdown(line.slice(4)); continue; }
    const list = line.match(/^(?:[-+] |\d+\. )(.*)$/);
    if (list) { flush(); const text = cleanMarkdown(list[1]); if (text) output.push(subheading ? `${subheading}: ${text}` : text); continue; }
    paragraph.push(line);
  }
  flush();
  return [...new Set(output)];
}

export function subsectionItems(markdown: string, ...headings: string[]) {
  for (const heading of headings) {
    const match = markdown.match(new RegExp(`^### ${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\r?\\n([\\s\\S]*?)(?=^### |^## |(?![\\s\\S]))`, "m"));
    if (match) return sectionItems(`## value\n${match[1]}`, "value").map((item) => item.replace(/[.;]+$/, ""));
  }
  return [];
}

export function subsections(markdown: string, heading: string): LabeledContent[] {
  const raw = section(markdown, heading);
  const matches = [...raw.matchAll(/^### (.+)\r?\n([\s\S]*?)(?=^### |$)/gm)];
  return matches.map((match) => ({ label: cleanMarkdown(match[1]), content: sectionItems(`## value\n${match[2]}`, "value") })).filter((item) => item.content.length);
}

export function relations(markdown: string, ...headings: string[]): ExerciseRelation[] {
  return sectionItems(markdown, ...headings).map((item) => {
    const targetId = item.match(/EX-\d{3}/)?.[0];
    const [label, ...description] = item.split(": ");
    return { targetId, label, description: description.join(": ") || undefined };
  });
}
