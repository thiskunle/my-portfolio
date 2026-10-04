import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** Heading element. Sections use h2; the page's single h1 lives in the hero. */
  as?: "h1" | "h2" | "h3";
  /** Pass to the section's aria-labelledby. */
  id?: string;
  align?: "start" | "center";
  className?: string;
};

const titleSizes = {
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
} as const;

export function SectionHeading({
  title,
  eyebrow,
  description,
  as: Heading = "h2",
  id,
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="mb-4 font-display text-eyebrow font-medium text-forest uppercase sm:mb-5">
          {eyebrow}
        </p>
      ) : null}
      <Heading id={id} className={titleSizes[Heading]}>
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "mt-4 max-w-[56ch] text-lead text-ink-2 sm:mt-5",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
