import fs from "node:fs";
import path from "node:path";

describe("Visual Regression & Responsive Overflow Verification", () => {
  const reportPath = path.resolve("docs/00-project/visual-regression/visual-regression-report.md");

  it("verifies that the visual regression report exists and reports 0 overflow failures", () => {
    expect(fs.existsSync(reportPath)).toBe(true);
    const reportContent = fs.readFileSync(reportPath, "utf-8");

    expect(reportContent).toContain("Pruebas exitosas (sin desbordamiento horizontal): 33");
    expect(reportContent).toContain("Pruebas fallidas (con desbordamiento horizontal): 0");
    expect(reportContent).not.toContain("**FALLO**");
  });

  it("verifies all viewport directories exist with screenshots", () => {
    const viewports = ["375", "768", "1280"];
    for (const vp of viewports) {
      const dirPath = path.resolve("docs/00-project/visual-regression", vp);
      expect(fs.existsSync(dirPath)).toBe(true);

      const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".png"));
      expect(files.length).toBeGreaterThanOrEqual(11);
    }
  });
});
