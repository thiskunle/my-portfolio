import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Wraps text in a hand-drawn underline. The stroke starts hidden (see .gb-scribble in
 * app/globals.css) and is drawn by drawScribbles() in lib/animations.ts as it scrolls into view.
 */
export function Scribble({
  children,
  tone = "accent",
  className,
}: {
  children: ReactNode;
  /** "accent" tints the text; "inherit" keeps the surrounding colour. */
  tone?: "accent" | "inherit";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-block",
        tone === "accent" && "text-ink-2",
        className,
      )}
    >
      {children}
      <svg
        aria-hidden
        className="gb-scribble"
        viewBox="0 0 300 24"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path pathLength={1} d="M4 15 C 52 6, 104 5, 152 11 S 238 21, 296 8" />
      </svg>
    </span>
  );
}
