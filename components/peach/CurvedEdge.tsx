import { cn } from "@/lib/cn";

/**
 * Soft wave along a section's top edge. Place it first inside a `relative` .gb-section: it
 * sits just above the section and is filled with the section's --section-bg, so the boundary
 * reads as a curve instead of a straight line.
 */
export function CurvedEdge({ flip = false, className }: { flip?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-full block h-12 w-full sm:h-16 lg:h-20",
        flip && "-scale-x-100",
        className,
      )}
    >
      <path
        fill="var(--section-bg)"
        d="M0 96 V58 C 160 18, 330 8, 520 34 S 880 92, 1100 62 S 1360 12, 1440 30 V96 Z"
      />
    </svg>
  );
}
