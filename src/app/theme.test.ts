import {
  isTheme,
  loadTheme,
  saveTheme,
  resolveEffectiveTheme,
  applyThemeToDocument,
  THEME_STORAGE_KEY,
} from "./theme";

describe("Theme Storage and Resolution (DEC-B)", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  describe("isTheme validator", () => {
    it("validates light, dark, and system as valid themes", () => {
      expect(isTheme("light")).toBe(true);
      expect(isTheme("dark")).toBe(true);
      expect(isTheme("system")).toBe(true);
    });

    it("rejects invalid values", () => {
      expect(isTheme("blue")).toBe(false);
      expect(isTheme("")).toBe(false);
      expect(isTheme(null)).toBe(false);
      expect(isTheme(123)).toBe(false);
      expect(isTheme({})).toBe(false);
    });
  });

  describe("loadTheme", () => {
    it("defaults to 'system' when localStorage is empty", () => {
      expect(loadTheme()).toBe("system");
    });

    it("loads valid stored theme from localStorage", () => {
      localStorage.setItem(THEME_STORAGE_KEY, "dark");
      expect(loadTheme()).toBe("dark");

      localStorage.setItem(THEME_STORAGE_KEY, "light");
      expect(loadTheme()).toBe("light");
    });

    it("returns 'system' and discards corrupt/unrecognized values", () => {
      localStorage.setItem(THEME_STORAGE_KEY, "neon-theme");
      expect(loadTheme()).toBe("system");
    });

    it("handles storage exceptions gracefully", () => {
      const faultyStorage = {
        getItem: () => {
          throw new Error("Quota or security error");
        },
      };
      expect(loadTheme(faultyStorage)).toBe("system");
    });
  });

  describe("saveTheme", () => {
    it("persists theme into localStorage under versioned key", () => {
      saveTheme("dark");
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

      saveTheme("light");
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    });

    it("handles storage errors gracefully without throwing", () => {
      const faultyStorage = {
        setItem: () => {
          throw new Error("Disk full");
        },
      };
      expect(() => saveTheme("dark", faultyStorage)).not.toThrow();
    });
  });

  describe("resolveEffectiveTheme", () => {
    it("resolves explicit 'light' to 'light' regardless of system preference", () => {
      expect(resolveEffectiveTheme("light", false)).toBe("light");
      expect(resolveEffectiveTheme("light", true)).toBe("light");
    });

    it("resolves explicit 'dark' to 'dark' regardless of system preference", () => {
      expect(resolveEffectiveTheme("dark", false)).toBe("dark");
      expect(resolveEffectiveTheme("dark", true)).toBe("dark");
    });

    it("resolves 'system' according to prefersDark flag", () => {
      expect(resolveEffectiveTheme("system", false)).toBe("light");
      expect(resolveEffectiveTheme("system", true)).toBe("dark");
    });
  });

  describe("applyThemeToDocument", () => {
    it("sets data-theme attribute on documentElement when theme is explicit", () => {
      const doc = document.implementation.createHTMLDocument();

      applyThemeToDocument("dark", doc);
      expect(doc.documentElement.getAttribute("data-theme")).toBe("dark");

      applyThemeToDocument("light", doc);
      expect(doc.documentElement.getAttribute("data-theme")).toBe("light");
    });

    it("removes data-theme attribute when theme is 'system'", () => {
      const doc = document.implementation.createHTMLDocument();
      doc.documentElement.setAttribute("data-theme", "dark");

      applyThemeToDocument("system", doc);
      expect(doc.documentElement.hasAttribute("data-theme")).toBe(false);
    });
  });
});
