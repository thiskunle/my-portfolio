import Image from "next/image";
import { brandAssets, company } from "@/lib/content";
import { cn } from "@/lib/cn";

type BrandProps = {
  /** "compact": logo mark + wordmark (header). "full": the full GramByte logo (footer). */
  variant?: "compact" | "full";
  className?: string;
};

/**
 * GramByte brand link back to the top of the page. The genuine logo artwork sits on its own
 * dark slate background, so both variants present it on a matching plate. The link carries the
 * accessible name; the images are decorative within it.
 */
export function Brand({ variant = "compact", className }: BrandProps) {
  return (
    <a
      href="#top"
      aria-label={`${company.name}, back to top`}
      className={cn(
        "inline-flex min-h-11 items-center gap-2.5 rounded-md font-display text-xl font-bold text-ink",
        className,
      )}
    >
      {variant === "full" ? (
        <span className="block rounded-card bg-logo-plate px-5 py-4">
          <Image
            src={brandAssets.logo.src}
            alt=""
            width={240}
            height={107}
            className="h-auto w-52 sm:w-60"
          />
        </span>
      ) : (
        <>
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-logo-plate p-1">
            <Image src={brandAssets.mark.src} alt="" width={28} height={23} className="h-auto w-7" />
          </span>
          {company.shortName}
        </>
      )}
    </a>
  );
}
