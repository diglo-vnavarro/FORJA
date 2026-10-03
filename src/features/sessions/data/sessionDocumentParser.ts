import { section } from "@/features/exercises/data/documentAdapter";
import type { Session, SessionAdaptation, SessionBlock, SessionStatus, SessionTask } from "@/features/sessions/domain/session";

// Convierte una ficha SES-STD-001 (Markdown) en el modelo de la aplicación.
// El documento es la fuente de verdad; aquí solo se añaden metadatos técnicos que el
// documento no contiene: slug de la URL y los identificadores estables de cada bloque,
// de los que dependen los borradores guardados en el navegador.
export type SessionSource = {
  markdown: string;
  slug: string;
  sourcePath: string;
  blockIds: string[];
};

export type ParsedSession = { session: Session; problems: string[] };

type Entry = { kind: "paragraph" | "item"; text: string };

const STATUS: Record<string, SessionStatus> = { borrador: "draft", utilizable: "usable", revisada: "reviewed", consolidada: "consolidated" };
const LEVELS: Record<string, SessionAdaptation["level"]> = { "ajuste menor": "minor", "ajuste de tarea": "task", "ajuste de objetivo": "objective" };

const clean = (value: string) => value
  .replace(/\[([^\]]+)]\([^)]+\)/g, "$1").replace(/[*_`>]/g, "").replace(/\s+/g, " ").trim();
const capitalize = (value: string) => value.charAt(0).toLocaleUpperCase("es") + value.slice(1);
// Los elementos de lista del documento van en minúscula y terminan en «;»: en la interfaz
// se muestran como frases independientes.
const sentence = (value: string) => {
  const text = clean(value).replace(/[\s;,.]+$/, "");
  return text ? `${capitalize(text)}.` : "";
};

// Párrafos y elementos de lista en el orden del documento. Las líneas sangradas continúan
// el elemento anterior.
export function entries(raw: string): Entry[] {
  const output: Entry[] = [];
  let current: Entry | null = null;
  const flush = () => {
    if (current && clean(current.text)) output.push({ kind: current.kind, text: current.kind === "item" ? sentence(current.text) : clean(current.text) });
    current = null;
  };
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "---" || trimmed.startsWith("#")) { flush(); continue; }
    const item = trimmed.match(/^(?:[-+*] |\d+\. )(.*)$/);
    if (item) { flush(); current = { kind: "item", text: item[1] }; continue; }
    if (current) { current.text += ` ${trimmed}`; continue; }
    current = { kind: "paragraph", text: trimmed };
  }
  flush();
  return output;
}

const texts = (raw: string) => entries(raw).map((entry) => entry.text);
const items = (raw: string) => entries(raw).filter((entry) => entry.kind === "item").map((entry) => entry.text);
const paragraphs = (raw: string) => entries(raw).filter((entry) => entry.kind === "paragraph").map((entry) => entry.text);
const cells = (row: string) => row.trim().replace(/^\||\|$/g, "").split("|").map((cell) => clean(cell));

function parseBlocks(raw: string, blockIds: string[], problems: string[]): SessionBlock[] {
  const blocks = [...raw.matchAll(/^### (.+)\r?\n([\s\S]*?)(?=^### |(?![\s\S]))/gm)];
  if (blocks.length !== blockIds.length) problems.push(`Hay ${blocks.length} bloques y ${blockIds.length} identificadores de bloque.`);
  return blocks.map(([, heading, body], index) => {
    const name = clean(heading).replace(/^Bloque \d+\s*[—-]\s*/, "");
    const chunks = body.split(/\r?\n\s*\r?\n/).map((chunk) => chunk.trim()).filter(Boolean);
    const purposeChunk = chunks.find((chunk) => chunk.startsWith("Propósito:"));
    const tableRows = chunks.filter((chunk) => chunk.startsWith("|")).flatMap((chunk) => chunk.split(/\r?\n/))
      .filter((row) => !/^\|\s*-/.test(row.trim())).slice(1);
    const notes = chunks.filter((chunk) => chunk !== purposeChunk && !chunk.startsWith("|")).flatMap(paragraphs);
    const tasks = tableRows.map((row, rowIndex): SessionTask => {
      const [exercise = "", prescription = "", quality = "", adaptation = "", stop = ""] = cells(row);
      const exerciseId = exercise.match(/EX-\d{3}/)?.[0] as SessionTask["exerciseId"] | undefined;
      if (!exerciseId || !prescription || !quality || !adaptation || !stop) problems.push(`Bloque ${index + 1}, tarea ${rowIndex + 1}: faltan columnas o la referencia EX.`);
      return { exerciseId: exerciseId ?? "EX-000", prescription, quality, adaptations: [adaptation], stopCriteria: [stop] };
    });
    const purpose = purposeChunk ? sentence(purposeChunk.replace(/^Propósito:\s*/, "")) : "";
    if (!purpose) problems.push(`Bloque ${index + 1}: falta «Propósito:».`);
    if (!tasks.length) problems.push(`Bloque ${index + 1}: no tiene tareas.`);
    return { id: blockIds[index] ?? `bloque-${index + 1}`, name, purpose, notes, tasks };
  });
}

function parseAdaptations(raw: string, problems: string[]): SessionAdaptation[] {
  const adaptations = [...raw.matchAll(/^### (.+)\r?\n([\s\S]*?)(?=^### |(?![\s\S]))/gm)].map(([, heading, body]) => {
    const label = clean(heading);
    return { level: LEVELS[label.toLowerCase()], label, items: texts(body) };
  });
  const levels = adaptations.map((adaptation) => adaptation.level);
  if (levels.join() !== "minor,task,objective") problems.push("Las adaptaciones globales deben ser «Ajuste menor», «Ajuste de tarea» y «Ajuste de objetivo», en ese orden.");
  return adaptations.filter((adaptation): adaptation is SessionAdaptation => Boolean(adaptation.level));
}

export function parseSessionDocument(source: SessionSource): ParsedSession {
  const { markdown } = source;
  const problems: string[] = [];
  const required = (heading: string) => {
    const raw = section(markdown, heading);
    if (!raw) problems.push(`Falta la sección «${heading}» o está vacía.`);
    return raw;
  };

  const title = markdown.match(/^# (SES-\d{3})\s*[—-]\s*(.+)$/m);
  if (!title) problems.push("El título debe tener la forma «# SES-000 — Nombre».");
  const [statusWord = "", ...versionParts] = clean(required("Estado")).replace(/\.$/, "").split(",");
  const status = STATUS[statusWord.trim().toLowerCase()];
  if (!status) problems.push(`Estado desconocido: «${statusWord.trim()}».`);
  const [purpose = "", ...purposeNotes] = paragraphs(required("Propósito"));

  const session: Session = {
    identity: {
      id: (title?.[1] ?? "SES-000") as Session["identity"]["id"],
      slug: source.slug,
      name: clean(title?.[2] ?? ""),
      status: status ?? "draft",
      version: capitalize(versionParts.join(",").trim()),
    },
    purpose,
    purposeNotes,
    primaryPriority: paragraphs(required("Prioridad principal")).join(" "),
    secondaryObjectives: items(required("Objetivos secundarios")),
    notPrioritized: items(required("Qué no prioriza")),
    context: {
      profile: texts(required("Contexto previsto")),
      weekly: texts(required("Relación con la semana y el deporte")),
      resources: texts(required("Recursos y organización")),
    },
    readinessChecks: items(required("Comprobación inicial")),
    blocks: parseBlocks(required("Sesión"), source.blockIds, problems),
    adaptations: parseAdaptations(required("Adaptaciones globales"), problems),
    recordAfter: items(required("Registro posterior")),
    traceability: {
      sourcePath: source.sourcePath,
      decisions: [...new Set([...required("Trazabilidad").matchAll(/`(F-[A-Z]+-\d{3})`/g)].map((match) => match[1]))],
    },
    usageNote: paragraphs(required("Nota de uso")).join(" "),
  };

  for (const [field, value] of Object.entries({ purpose, primaryPriority: session.primaryPriority, usageNote: session.usageNote })) {
    if (!value) problems.push(`El campo ${field} ha quedado vacío.`);
  }
  for (const [field, list] of Object.entries({ secondaryObjectives: session.secondaryObjectives, notPrioritized: session.notPrioritized, readinessChecks: session.readinessChecks, recordAfter: session.recordAfter, decisions: session.traceability.decisions })) {
    if (!list.length) problems.push(`La lista ${field} ha quedado vacía.`);
  }
  return { session, problems: problems.map((problem) => `${session.identity.id}: ${problem}`) };
}
