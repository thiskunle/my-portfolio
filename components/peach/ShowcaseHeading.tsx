import type { ReactNode } from "react";
import { Scribble } from "@/components/peach/Scribble";
import { SectionPill } from "@/components/peach/SectionPill";
import { cn } from "@/lib/cn";

type ShowcaseHeadingProps = {
  eyebrow: string;
  title: string;
  /** Highlighted, underlined continuation of the title. */
  accent?: string;
  /** Pass to the section's aria-labelledby. */
  id: string;
  /** Small aside under the title, e.g. an interaction hint. */
  note?: ReactNode;
  align?: "start" | "center";
  className?: string;
};

/** Section header for the showcase sections: pill, oversized title, optional hint. */
export function ShowcaseHeading({
  eyebrow,
  title,
  accent,
  id,
  note,
  align = "start",
  className,
}: ShowcaseHeadingProps) {
  return (
    <div className={cn("max-w-4xl", align === "center" && "mx-auto text-center", className)}>
      <SectionPill>{eyebrow}</SectionPill>
      <h2 id={id} className="mt-5 font-display text-showcase font-extrabold uppercase">
        {title}
        {accent ? (
          <>
            {" "}
            <Scribble>{accent}</Scribble>
          </>
        ) : null}
      </h2>
      {note ? <p className="mt-5 text-ink-2">{note}</p> : null}
    </div>
  );
}
