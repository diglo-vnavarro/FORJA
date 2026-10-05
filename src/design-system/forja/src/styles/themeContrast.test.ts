/**
 * WCAG 2.1 Contrast Ratio Verification for FORJA Light & Dark Themes (DEC-B / F1-07)
 */

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function getLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("WCAG 2.1 AA Contrast Ratios (DEC-B)", () => {
  describe("Light Theme Palette", () => {
    const white = "#FFFFFF";
    const primary = "#0B2A4A";
    const grayDark = "#1F2937";
    const secondary = "#1D5AD8";
    const green = "#16A34A";
    const ochre = "#986318";
    const red = "#DC2626";

    it("verifies primary text against white background satisfies WCAG AAA (>= 7:1)", () => {
      const ratio = getContrastRatio(primary, white);
      expect(ratio).toBeGreaterThanOrEqual(7.0);
    });

    it("verifies gray-dark body text against white satisfies WCAG AAA (>= 7:1)", () => {
      const ratio = getContrastRatio(grayDark, white);
      expect(ratio).toBeGreaterThanOrEqual(7.0);
    });

    it("verifies secondary blue against white satisfies WCAG AA (>= 4.5:1)", () => {
      const ratio = getContrastRatio(secondary, white);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it("verifies status colors on white satisfy WCAG AA for UI components and graphical elements (>= 3:1)", () => {
      expect(getContrastRatio(green, white)).toBeGreaterThanOrEqual(3.0);
      expect(getContrastRatio(ochre, white)).toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio(red, white)).toBeGreaterThanOrEqual(3.0);
    });
  });

  describe("Dark Theme Palette", () => {
    const darkSurfacePage = "#0B111E";
    const darkSurfaceCard = "#131E31";
    const darkTextPrimary = "#F1F5F9";
    const darkTextSecondary = "#94A3B8";
    const darkSecondary = "#3B82F6";
    const darkGreen = "#4ADE80";
    const darkOchre = "#FBBF24";
    const darkRed = "#F87171";

    it("verifies primary text against dark card and page background satisfies WCAG AAA (>= 7:1)", () => {
      expect(getContrastRatio(darkTextPrimary, darkSurfacePage)).toBeGreaterThanOrEqual(7.0);
      expect(getContrastRatio(darkTextPrimary, darkSurfaceCard)).toBeGreaterThanOrEqual(7.0);
    });

    it("verifies secondary text against dark card and page background satisfies WCAG AA (>= 4.5:1)", () => {
      expect(getContrastRatio(darkTextSecondary, darkSurfacePage)).toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio(darkTextSecondary, darkSurfaceCard)).toBeGreaterThanOrEqual(4.5);
    });

    it("verifies secondary blue against dark card and page background satisfies WCAG AA (>= 4.5:1)", () => {
      expect(getContrastRatio(darkSecondary, darkSurfacePage)).toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio(darkSecondary, darkSurfaceCard)).toBeGreaterThanOrEqual(4.5);
    });

    it("verifies status colors on dark surfaces satisfy WCAG AA (>= 4.5:1)", () => {
      expect(getContrastRatio(darkGreen, darkSurfaceCard)).toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio(darkOchre, darkSurfaceCard)).toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio(darkRed, darkSurfaceCard)).toBeGreaterThanOrEqual(4.5);
    });
  });
});
