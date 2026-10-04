import { company } from "@/lib/content";
import { cn } from "@/lib/cn";

/**
 * Text wordmark placeholder. Swap for the supplied GramByte logo (next/image, fixed
 * width/height) when the asset arrives; this is the only place that needs to change.
 */
export function Brand({ className }: { className?: string }) {
  return (
    <a
      href="#top"
      aria-label={`${company.name}, back to top`}
      className={cn(
        "inline-flex min-h-11 items-center rounded-md font-display text-xl font-bold text-ink",
        className,
      )}
    >
      {company.shortName}
    </a>
  );
}
