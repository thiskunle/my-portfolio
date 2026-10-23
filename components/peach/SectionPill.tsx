import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Rounded label that introduces each showcase section. */
export function SectionPill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-ink/8 px-4 py-2 font-display text-sm font-semibold text-ink ring-1 ring-ink/20",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}
