import { section } from "@/features/exercises/data/documentAdapter";
import type {
  Assessment,
  AssessmentDecisionBranch,
  AssessmentRequirement,
  AssessmentStatus,
  AssessmentTask,
  AssessmentTaskCriteria,
  AssessmentTaskDecision,
} from "../domain/assessment";

export type AssessmentSource = {
  markdown: string;
  slug: string;
  sourcePath: string;
};

export type ParsedAssessment = {
  assessment: Assessment;
  problems: string[];
};

const clean = (value: string) =>
  value
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

function parseStatus(raw: string): AssessmentStatus {
  const text = raw.toLowerCase();
  if (text.includes("consolidada")) return "consolidated";
  if (text.includes("utilizable")) return "usable";
  if (text.includes("revisión") || text.includes("revision")) return "review";
  return "draft";
}

function parseRequirements(raw: string, problems: string[]): AssessmentRequirement {
  const extract = (label: string): string => {
    const regex = new RegExp(`-\\s*\\*\\*${label}\\*\\*:\\s*(.+)`, "i");
    const match = raw.match(regex);
    if (!match) {
      problems.push(`Falta el requisito «${label}» en Requisitos de aplicación.`);
      return "";
    }
    return clean(match[1]);
  };

  return {
    space: extract("Espacio"),
    equipment: extract("Material"),
    estimatedDuration: extract("Duración estimada"),
    warmup: extract("Calentamiento previo"),
  };
}

function parseTasks(raw: string, problems: string[]): AssessmentTask[] {
  const taskBlocks = [...raw.matchAll(/^### Tarea\s*(\d+)[:\s-–—]+(.+)\r?\n([\s\S]*?)(?=^### Tarea|\n## |(?![\s\S]))/gm)];

  if (!taskBlocks.length) {
    problems.push("No se encontraron tareas en «Batería de tareas observadas».");
    return [];
  }

  return taskBlocks.map(([, num, titleRaw, body]) => {
    const title = clean(titleRaw);
    const id = `tarea-${num}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

    const extractField = (name: string): string => {
      const match = body.match(new RegExp(`-\\s*\\*\\*${name}\\*\\*:\\s*([\\s\\S]*?)(?=\\r?\\n-\\s*\\*\\*|\\r?\\n---|$|(?=\\r?\\n\\r?\\n))`, "i"));
      if (!match) {
        problems.push(`Tarea ${num} (${title}): falta el campo «${name}».`);
        return "";
      }
      return clean(match[1]);
    };

    const objective = extractField("Objetivo");
    const cue = extractField("Consigna");
    const whatToObserve = extractField("Qué observar");

    // Parse criteria
    const criteriaSectionMatch = body.match(/-\s*\*\*Criterios de competencia\*\*:([\s\S]*?)(?=-\s*\*\*Decisión FORJA\*\*:|---|$)/i);
    const criteriaBody = criteriaSectionMatch ? criteriaSectionMatch[1] : "";

    const extractCriterion = (level: string): string => {
      const match = criteriaBody.match(new RegExp(`\\*${level}\\*:\\s*([^\\r\\n]+)`, "i"));
      if (!match) {
        problems.push(`Tarea ${num} (${title}): falta el criterio «${level}».`);
        return "";
      }
      return clean(match[1]);
    };

    const criteria: AssessmentTaskCriteria = {
      sufficient: extractCriterion("Suficiente"),
      partial: extractCriterion("Parcial"),
      insufficient: extractCriterion("Insuficiente"),
    };

    // Parse decision
    const decisionSectionMatch = body.match(/-\s*\*\*Decisión FORJA\*\*:([\s\S]*?)(?=---|\r?\n\r?\n### |$)/i);
    const decisionBody = decisionSectionMatch ? decisionSectionMatch[1] : "";

    const extractBranch = (labelRegex: RegExp): AssessmentDecisionBranch | undefined => {
      const match = decisionBody.match(labelRegex);
      if (!match) return undefined;
      const text = match[1];
      const exIds = [...text.matchAll(/EX-\d{3}/g)].map((m) => m[0] as `EX-${string}`);
      return {
        exerciseIds: exIds,
        description: clean(text),
      };
    };

    const sufficientBranch = extractBranch(/Suficiente\s*→\s*([^\r\n]+)/i);
    const partialBranch = extractBranch(/Parcial\s*→\s*([^\r\n]+)/i);
    const insufficientBranch = extractBranch(/Insuficiente\s*→\s*([^\r\n]+)/i);
    const combinedBranch = extractBranch(/Parcial\/Insuficiente\s*→\s*([^\r\n]+)/i);

    if (!sufficientBranch) {
      problems.push(`Tarea ${num} (${title}): falta la decisión para «Suficiente».`);
    }

    const decision: AssessmentTaskDecision = {
      sufficient: sufficientBranch ?? { exerciseIds: [], description: "" },
      ...(combinedBranch ? { partialOrInsufficient: combinedBranch } : {}),
      ...(partialBranch ? { partial: partialBranch } : {}),
      ...(insufficientBranch ? { insufficient: insufficientBranch } : {}),
    };

    return {
      id,
      title,
      objective,
      cue,
      whatToObserve,
      criteria,
      decision,
    };
  });
}

export function parseAssessmentDocument(source: AssessmentSource): ParsedAssessment {
  const { markdown, slug, sourcePath } = source;
  const problems: string[] = [];

  const required = (heading: string): string => {
    const raw = section(markdown, heading);
    if (!raw) {
      problems.push(`Falta la sección «${heading}» o está vacía.`);
      return "";
    }
    return raw;
  };

  const titleMatch = markdown.match(/^#\s*(EVAL-\d{3})\s*[—-]\s*(.+)$/m);
  if (!titleMatch) {
    problems.push("Falta el encabezado de nivel 1 con el formato «# EVAL-NNN — Nombre».");
  }
  const id = (titleMatch?.[1] ?? "EVAL-000") as `EVAL-${string}`;
  const name = clean(titleMatch?.[2] ?? "");

  const statusRaw = required("Estado");
  const status = parseStatus(statusRaw);

  const purposeRaw = required("Propósito");
  const purposeParagraphs = purposeRaw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith(">") && !l.startsWith("---"));
  const purpose = clean(purposeParagraphs.join(" "));

  const questionMatch = purposeRaw.match(/>\s*\*\*([^*]+)\*\*/);
  const operationalQuestion = questionMatch ? clean(questionMatch[1]) : "";
  if (!operationalQuestion) {
    problems.push("Falta la pregunta operativa en bloque de cita «> **¿...?**» en Propósito.");
  }

  const referencesRaw = section(markdown, "Documentos de referencia");
  const references = referencesRaw
    ? [...referencesRaw.matchAll(/-\s*([^\r\n]+)/g)].map((m) => clean(m[1]))
    : [];

  const requirementsRaw = required("Requisitos de aplicación");
  const requirements = parseRequirements(requirementsRaw, problems);

  const safetyRaw = required("Seguridad y criterios de exclusión");
  const safetyAndStopCriteria = [...safetyRaw.matchAll(/-\s*([^\r\n]+)/g)].map((m) => clean(m[1]));

  const tasksRaw = required("Batería de tareas observadas");
  const tasks = parseTasks(tasksRaw, problems);

  const summaryRaw = section(markdown, "Resumen de toma de decisiones");
  const decisionSummary = summaryRaw
    ? summaryRaw
        .split(/\r?\n/)
        .map((l) => clean(l))
        .filter(Boolean)
    : [];

  const assessment: Assessment = {
    identity: {
      id,
      slug,
      name,
      status,
      version: clean(statusRaw.replace(/^[^-—]+[-—]/, "")).slice(0, 50),
    },
    purpose,
    operationalQuestion,
    references,
    requirements,
    safetyAndStopCriteria,
    tasks,
    decisionSummary,
    traceability: {
      sourcePath,
    },
  };

  return { assessment, problems };
}
