import { describe, it, expect } from "vitest";
import { buildSearchIndex, searchCatalog } from "./searchCatalog";
import { glossaryParseResult, glossaryTerms } from "./glossaryDocuments";
import { exercises } from "@/features/exercises/data/exercises";
import { sessions } from "@/features/sessions/data/sessions";

describe("searchCatalog data", () => {
  it("parses the canonical glossary document without problems", () => {
    expect(glossaryParseResult.problems).toEqual([]);
    expect(glossaryTerms.length).toBeGreaterThan(50);
  });

  it("builds an in-memory search index containing exercises, sessions and glossary terms", () => {
    const index = buildSearchIndex();

    expect(index.length).toBeGreaterThanOrEqual(
      exercises.length + sessions.length + glossaryTerms.length,
    );

    const exerciseItems = index.filter((i) => i.kind === "exercise");
    const sessionItems = index.filter((i) => i.kind === "session");
    const glossaryItems = index.filter((i) => i.kind === "glossary");

    expect(exerciseItems.length).toBe(exercises.length);
    expect(sessionItems.length).toBe(sessions.length);
    expect(glossaryItems.length).toBe(glossaryTerms.length);
  });

  it("searches across all real loaded content by name, alias, pattern, capability and material", () => {
    // 1. By exercise name
    const byName = searchCatalog("sentadilla goblet");
    expect(byName.length).toBeGreaterThan(0);
    expect(byName[0].item.id).toBe("EX-002");

    // 2. By alias
    const byAlias = searchCatalog("goblet squat");
    expect(byAlias.length).toBeGreaterThan(0);
    expect(byAlias[0].item.id).toBe("EX-002");

    // 3. By movement pattern
    const byPattern = searchCatalog("dominante de rodilla");
    expect(byPattern.some((r) => r.item.id === "EX-002")).toBe(true);

    // 4. By physical quality / capability
    const byCapability = searchCatalog("fuerza basica");
    expect(byCapability.some((r) => r.item.kind === "exercise")).toBe(true);

    // 5. By equipment / material
    const byEquipment = searchCatalog("mancuerna");
    expect(byEquipment.some((r) => r.item.equipment.some((e) => e.toLowerCase().includes("mancuerna")))).toBe(true);

    // 6. By session ID or name
    const bySession = searchCatalog("SES-001");
    expect(bySession.length).toBeGreaterThan(0);
    expect(bySession[0].item.id).toBe("SES-001");

    // 7. By glossary term
    const byGlossary = searchCatalog("1RM");
    expect(byGlossary.length).toBeGreaterThan(0);
    expect(byGlossary[0].item.id).toBe("glossary-1rm-una-repeticion-maxima");
  });
});
