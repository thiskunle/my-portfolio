export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "gb-theme";

/** Browser UI colors. Mirrors --gb-paper for each theme in app/globals.css. */
export const themeColors: Record<Theme, string> = {
  light: "#f2f0ea",
  dark: "#111613",
};

/**
 * Runs in <head> before first paint. Applies a stored manual choice only;
 * without one, CSS follows prefers-color-scheme.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}
