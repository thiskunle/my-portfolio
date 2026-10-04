"use client";

import { useLayoutEffect } from "react";
import { buttonStyles } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { readStoredTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function currentTheme(): Theme {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "light" || explicit === "dark") return explicit;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Switches between light and dark. The first visit follows the system preference;
 * a click stores an explicit choice.
 *
 * The icon and accessible name are driven by the `dark:` variant rather than React state,
 * so server and client markup always match and there is no hydration flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
  // React's dev-only Strict Mode remount clears attributes set by the inline head script.
  // Re-apply the stored choice before paint. No-op in production.
  useLayoutEffect(() => {
    const stored = readStoredTheme();
    if (stored) document.documentElement.setAttribute("data-theme", stored);
  }, []);

  function toggle() {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode, blocked): the choice lasts for this page view.
    }
  }

  return (
    <button type="button" onClick={toggle} className={cn(buttonStyles({ variant: "icon" }), className)}>
      <Icon name="moon" className="dark:hidden" />
      <Icon name="sun" className="hidden dark:block" />
      <span className="sr-only dark:hidden">Switch to dark theme</span>
      <span className="sr-only hidden dark:inline">Switch to light theme</span>
    </button>
  );
}
