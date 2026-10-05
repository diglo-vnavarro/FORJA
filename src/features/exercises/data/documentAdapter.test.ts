import { describe, expect, it } from "vitest";
import { sectionText } from "./documentAdapter";

describe("documentAdapter", () => {
  it("flattens bulleted and numbered lists without loose hyphens or markers", () => {
    const markdown = `
## Descripción

Descripción con texto introductorio:

- primera opción;
- segunda opción;
- tercera opción.

---
`;
    const result = sectionText(markdown, "Descripción");
    expect(result).not.toMatch(/(?:^|\s)-\s/);
    expect(result).toBe("Descripción con texto introductorio: primera opción; segunda opción; tercera opción.");
  });
});
