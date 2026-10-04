import { describe, it, expect } from "vitest";
import { parseGlossaryMarkdown, slugifyTerm } from "./glossary";

describe("glossary domain", () => {
  describe("slugifyTerm", () => {
    it("creates URL-safe slugs", () => {
      expect(slugifyTerm("1RM — Una repetición máxima")).toBe("1rm-una-repeticion-maxima");
      expect(slugifyTerm("Tronco / estabilización / transporte")).toBe("tronco-estabilizacion-transporte");
    });
  });

  describe("parseGlossaryMarkdown", () => {
    it("parses glossary terms with metadata", () => {
      const sampleMarkdown = `
# Glosario

## 0–9

### 1RM — Una repetición máxima

Mayor carga que una persona puede movilizar correctamente una sola vez.

Decisión FORJA: no es necesario conocer el 1RM.

Véase también: [Intensidad](#intensidad).

Fuente: [SCI-002](../02-science/youth-strength-training.md)

## A

### Agilidad

Acción rápida con toma de decisiones.

## Términos pendientes de definición

- Término pendiente 1
`;

      const result = parseGlossaryMarkdown(sampleMarkdown);

      expect(result.problems).toHaveLength(0);
      expect(result.terms).toHaveLength(2);

      const term1 = result.terms[0];
      expect(term1.title).toBe("1RM — Una repetición máxima");
      expect(term1.acronym).toBe("1RM");
      expect(term1.category).toBe("0–9");
      expect(term1.summary).toBe("Mayor carga que una persona puede movilizar correctamente una sola vez.");
      expect(term1.decision).toBe("no es necesario conocer el 1RM.");
      expect(term1.seeAlso).toEqual(["Intensidad"]);
      expect(term1.source).toBe("[SCI-002](../02-science/youth-strength-training.md)");

      const term2 = result.terms[1];
      expect(term2.title).toBe("Agilidad");
      expect(term2.acronym).toBeUndefined();
      expect(term2.category).toBe("A");
    });
  });
});
