import { useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "forja.theme.v1";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

export function loadTheme(storage: Pick<Storage, "getItem"> = localStorage): Theme {
  try {
    const raw = storage.getItem(THEME_STORAGE_KEY);
    if (raw && isTheme(raw)) {
      return raw;
    }
  } catch {
    // Retorna fallback si el almacenamiento local está restringido
  }
  return "system";
}

export function saveTheme(theme: Theme, storage: Pick<Storage, "setItem"> = localStorage): void {
  try {
    storage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Silencia fallos de cuota o permisos restringidos
  }
}

export function resolveEffectiveTheme(theme: Theme, prefersDark = false): "light" | "dark" {
  if (theme === "system") {
    return prefersDark ? "dark" : "light";
  }
  return theme;
}

export function applyThemeToDocument(
  theme: Theme,
  doc: Document = document,
  win: Window = window,
): "light" | "dark" {
  const prefersDark =
    typeof win.matchMedia === "function" ? win.matchMedia("(prefers-color-scheme: dark)").matches : false;
  const effective = resolveEffectiveTheme(theme, prefersDark);

  if (doc.documentElement) {
    if (theme === "system") {
      doc.documentElement.removeAttribute("data-theme");
    } else {
      doc.documentElement.setAttribute("data-theme", theme);
    }
  }
  return effective;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return loadTheme();
    }
    return "system";
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const effectiveTheme = resolveEffectiveTheme(theme, systemPrefersDark);

  const updateTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    saveTheme(nextTheme);
    applyThemeToDocument(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = effectiveTheme === "dark" ? "light" : "dark";
    updateTheme(nextTheme);
  }, [effectiveTheme, updateTheme]);

  useEffect(() => {
    applyThemeToDocument(theme);

    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  return {
    theme,
    effectiveTheme,
    setTheme: updateTheme,
    toggleTheme,
    isDark: effectiveTheme === "dark",
  };
}
