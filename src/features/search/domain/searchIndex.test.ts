import { describe, it, expect } from "vitest";
import {
  type SearchItem,
  normalizeSearchText,
  searchIndex,
} from "./searchIndex";

const sampleItems: SearchItem[] = [
  {
    id: "EX-002",
    kind: "exercise",
    title: "EX-002 · Sentadilla goblet",
    subtitle: "Dominante de rodilla",
    url: "/exercises/ex-002-goblet-squat",
    name: "Sentadilla goblet",
    aliases: ["Goblet squat", "Sentadilla con carga anterior"],
    pattern: "Dominante de rodilla",
    capabilities: ["Fuerza básica", "Control motor"],
    equipment: ["Mancuerna", "Kettlebell"],
    description: "Patrón básico bilateral con sobrecarga anterior.",
    keywords: ["sentadilla", "tren inferior"],
  },
  {
    id: "EX-010",
    kind: "exercise",
    title: "EX-010 · Remo con banda elástica",
    subtitle: "Tracción horizontal",
    url: "/exercises/ex-010-band-row",
    name: "Remo con banda elástica",
    aliases: ["Band row"],
    pattern: "Tracción horizontal",
    capabilities: ["Fuerza básica"],
    equipment: ["Banda elástica"],
    description: "Tracción bilateral con elástico.",
    keywords: ["espalda", "tracción"],
  },
  {
    id: "SES-001",
    kind: "session",
    title: "SES-001 · Fuerza básica de tren inferior",
    subtitle: "Sesión · usable",
    url: "/sessions/SES-001",
    name: "Fuerza básica de tren inferior",
    aliases: [],
    capabilities: [],
    equipment: ["Mancuernas", "Bancos"],
    description: "Sesión orientada a la consolidación de patrones básicos.",
    keywords: ["EX-002", "EX-003"],
  },
  {
    id: "glossary-1rm",
    kind: "glossary",
    title: "1RM — Una repetición máxima",
    subtitle: "Glosario · 0–9",
    url: "/glossary#1rm",
    name: "1RM — Una repetición máxima",
    aliases: ["1RM"],
    capabilities: [],
    equipment: [],
    description: "Mayor carga que una persona puede movilizar correctamente una sola vez.",
    keywords: ["intensidad", "fuerza máxima"],
  },
];

describe("searchIndex domain", () => {
  describe("normalizeSearchText", () => {
    it("strips diacritics and converts to lowercase", () => {
      expect(normalizeSearchText("Tracción Horizontal")).toBe("traccion horizontal");
      expect(normalizeSearchText("  Sentadilla GOBLET  ")).toBe("sentadilla goblet");
    });
  });

  describe("searchIndex query matching", () => {
    it("returns empty array for blank or whitespace query", () => {
      expect(searchIndex(sampleItems, "")).toEqual([]);
      expect(searchIndex(sampleItems, "   ")).toEqual([]);
    });

    it("searches by exact ID (e.g. EX-002)", () => {
      const results = searchIndex(sampleItems, "EX-002");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.id).toBe("EX-002");
    });

    it("searches by exercise name ignoring diacritics", () => {
      const results = searchIndex(sampleItems, "sentadilla");
      expect(results.some((r) => r.item.id === "EX-002")).toBe(true);
    });

    it("searches by alias (e.g. 'Goblet squat')", () => {
      const results = searchIndex(sampleItems, "Goblet squat");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.id).toBe("EX-002");
    });

    it("searches by movement pattern (e.g. 'Dominante de rodilla' / 'rodilla')", () => {
      const results = searchIndex(sampleItems, "rodilla");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.id).toBe("EX-002");
    });

    it("searches by capability / physical quality (e.g. 'Control motor')", () => {
      const results = searchIndex(sampleItems, "control motor");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.id).toBe("EX-002");
    });

    it("searches by equipment / material (e.g. 'banda elastica')", () => {
      const results = searchIndex(sampleItems, "banda elastica");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].item.id).toBe("EX-010");
    });

    it("searches by glossary acronym and title", () => {
      const resultsAcronym = searchIndex(sampleItems, "1RM");
      expect(resultsAcronym.length).toBeGreaterThan(0);
      expect(resultsAcronym[0].item.id).toBe("glossary-1rm");

      const resultsTitle = searchIndex(sampleItems, "repeticion maxima");
      expect(resultsTitle.length).toBeGreaterThan(0);
      expect(resultsTitle[0].item.id).toBe("glossary-1rm");
    });

    it("filters results by kind", () => {
      const allResults = searchIndex(sampleItems, "fuerza");
      expect(allResults.some((r) => r.item.kind === "exercise")).toBe(true);
      expect(allResults.some((r) => r.item.kind === "session")).toBe(true);

      const onlyExercises = searchIndex(sampleItems, "fuerza", ["exercise"]);
      expect(onlyExercises.every((r) => r.item.kind === "exercise")).toBe(true);

      const onlySessions = searchIndex(sampleItems, "fuerza", ["session"]);
      expect(onlySessions.every((r) => r.item.kind === "session")).toBe(true);
    });
  });
});
