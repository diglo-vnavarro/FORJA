import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("design tokens (F1-03 / D-011)", () => {
  const tokensPath = resolve(__dirname, "../design-system/forja/src/styles/forja-tokens.css");
  const tokensContent = readFileSync(tokensPath, "utf-8");

  it("defines exactly the 10 canonical brand colors of D-011 without new colors", () => {
    const expectedCanonicalColors: Record<string, string> = {
      "--forja-navy": "#0B2A4A",
      "--forja-blue": "#1D5AD8",
      "--forja-blue-light": "#E6F0FB",
      "--forja-gray-dark": "#1F2937",
      "--forja-gray-mid": "#6B7780",
      "--forja-gray-light": "#E5E7EB",
      "--forja-green": "#16A34A",
      "--forja-red": "#DC2626",
      "--forja-ochre": "#986318",
      "--forja-white": "#FFFFFF",
    };

    // Extract all hex colors declared in forja-tokens.css
    const hexColorRegex = /--forja-([a-z-]+):\s*(#[0-9A-Fa-f]{6})/g;
    const foundColors: Record<string, string> = {};
    let match: RegExpExecArray | null;

    while ((match = hexColorRegex.exec(tokensContent)) !== null) {
      foundColors[`--forja-${match[1]}`] = match[2].toUpperCase();
    }

    expect(Object.keys(foundColors).sort()).toEqual(Object.keys(expectedCanonicalColors).sort());

    for (const [varName, hexValue] of Object.entries(expectedCanonicalColors)) {
      expect(foundColors[varName]).toBe(hexValue);
    }
  });

  it("maintains regex compatibility with brand kit scripts", () => {
    const brandTokens = [
      "navy",
      "blue",
      "blue-light",
      "gray-dark",
      "gray-mid",
      "gray-light",
      "green",
      "red",
      "ochre",
      "white",
    ];

    for (const name of brandTokens) {
      const regex = new RegExp(`--forja-${name}:\\s*(#[0-9A-Fa-f]{6})`);
      const match = tokensContent.match(regex);
      expect(match, `Token --forja-${name} must match brand kit regex`).not.toBeNull();
    }
  });

  it("defines the fluid typography scale", () => {
    const typographicTokens = [
      "--forja-text-2xs",
      "--forja-text-xs",
      "--forja-text-sm",
      "--forja-text-base",
      "--forja-text-lg",
      "--forja-text-xl",
      "--forja-text-2xl",
      "--forja-text-3xl",
      "--forja-text-hero",
    ];

    for (const token of typographicTokens) {
      expect(tokensContent).toContain(token);
    }
  });

  it("defines standard and adaptive spacing tokens", () => {
    const spacingTokens = [
      "--forja-space-1",
      "--forja-space-2",
      "--forja-space-3",
      "--forja-space-4",
      "--forja-space-5",
      "--forja-space-6",
      "--forja-space-8",
      "--forja-space-10",
      "--forja-space-12",
      "--forja-space-16",
      "--forja-space-page-inline",
      "--forja-space-hero-padding",
    ];

    for (const token of spacingTokens) {
      expect(tokensContent).toContain(token);
    }
  });

  it("defines border radius tokens", () => {
    const radiusTokens = [
      "--forja-radius-xs",
      "--forja-radius-sm",
      "--forja-radius-md",
      "--forja-radius-lg",
      "--forja-radius-xl",
      "--forja-radius-2xl",
      "--forja-radius-full",
      "--forja-radius-circle",
    ];

    for (const token of radiusTokens) {
      expect(tokensContent).toContain(token);
    }
  });

  it("defines elevation and shadow tokens using D-011 colors", () => {
    const shadowTokens = [
      "--forja-shadow-sm",
      "--forja-shadow-md",
      "--forja-shadow-card",
      "--forja-shadow-lg",
    ];

    for (const token of shadowTokens) {
      expect(tokensContent).toContain(token);
    }
  });

  it("defines touch target dimensions compliant with mobile and field ergonomics", () => {
    expect(tokensContent).toContain("--forja-touch-min: 44px;");
    expect(tokensContent).toContain("--forja-touch-field: 48px;");
    expect(tokensContent).toContain("--forja-touch-lg: 56px;");
  });

  it("defines reference breakpoint tokens", () => {
    expect(tokensContent).toContain("--forja-breakpoint-mobile: 375px;");
    expect(tokensContent).toContain("--forja-breakpoint-compact: 520px;");
    expect(tokensContent).toContain("--forja-breakpoint-tablet: 760px;");
    expect(tokensContent).toContain("--forja-breakpoint-desktop: 1020px;");
    expect(tokensContent).toContain("--forja-breakpoint-wide: 1280px;");
  });
});
