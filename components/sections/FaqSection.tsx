"use client";

import { useRef } from "react";
import { CurvedEdge } from "@/components/peach/CurvedEdge";
import { ShowcaseHeading } from "@/components/peach/ShowcaseHeading";
import { Container } from "@/components/ui/Container";
import { drawScribbles } from "@/lib/animations";
import { faqSection } from "@/lib/content";
import { prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Common questions as native disclosures, so they work with the keyboard and without JavaScript. */
export function FaqSection() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;
      drawScribbles(root.current);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="faq" aria-labelledby="faq-title" className="gb-section gb-section-burgundy relative py-section text-ink">
      <CurvedEdge flip />
      <Container>
        <ShowcaseHeading
          id="faq-title"
          eyebrow={faqSection.eyebrow}
          title={faqSection.title}
          accent={faqSection.accent}
          align="center"
        />
        <div className="mx-auto mt-14 max-w-3xl divide-y divide-white/15 border-y border-white/15 sm:mt-20">
          {faqSection.items.map((item) => (
            // Opening an answer moves everything below it, so scroll positions are recalculated.
            <details key={item.id} className="group" onToggle={() => ScrollTrigger.refresh()}>
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 font-display text-xl font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="shrink-0 text-3xl leading-none font-normal transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[60ch] pb-6 text-ink-2">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
