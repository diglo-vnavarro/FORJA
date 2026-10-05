import { describe, expect, it } from "vitest";
import { getProgramById, programDocumentProblems, programs } from "./programs";

describe("programs catalog and markdown parser", () => {
  it("parses all program documents without structural problems", () => {
    expect(programDocumentProblems).toHaveLength(0);
  });

  it("loads canonical programs PROG-001 and PROG-002", () => {
    expect(programs.length).toBeGreaterThanOrEqual(2);
    const prog1 = getProgramById("PROG-001");
    const prog2 = getProgramById("PROG-002");

    expect(prog1).toBeDefined();
    expect(prog1?.title).toContain("Microciclo competitivo estándar");
    expect(prog1?.days).toHaveLength(7);

    expect(prog2).toBeDefined();
    expect(prog2?.title).toContain("Microciclo preparatorio de pretemporada");
    expect(prog2?.days).toHaveLength(7);
  });

  it("extracts daily match day labels, activities and linked sessions accurately", () => {
    const prog1 = getProgramById("PROG-001");
    expect(prog1).toBeDefined();

    // Check Sunday (MD)
    const matchDay = prog1?.days.find((d) => d.matchDayOffset === "MD");
    expect(matchDay).toBeDefined();
    expect(matchDay?.dayName).toBe("Domingo");
    expect(matchDay?.clubActivity).toContain("Partido oficial");

    // Check Tuesday (MD-5 with SES-002)
    const tuesday = prog1?.days.find((d) => d.dayName === "Martes");
    expect(tuesday?.matchDayOffset).toBe("MD-5");
    expect(tuesday?.sessionId).toBe("SES-002");
    expect(tuesday?.forjaStimulus).toContain("SES-002: Fuerza general");

    // Check Thursday (MD-3 with SES-003)
    const thursday = prog1?.days.find((d) => d.dayName === "Jueves");
    expect(thursday?.matchDayOffset).toBe("MD-3");
    expect(thursday?.sessionId).toBe("SES-003");
  });

  it("extracts dynamic adaptations properly", () => {
    const prog1 = getProgramById("PROG-001");
    expect(prog1?.adaptations.length).toBeGreaterThanOrEqual(2);
    expect(prog1?.adaptations[0].title).toContain("Variación según minutos disputados");
  });
});
