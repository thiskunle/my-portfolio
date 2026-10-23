"use client";

import { useRef } from "react";
import { CurvedEdge } from "@/components/peach/CurvedEdge";
import { LocationExplorer } from "@/components/peach/LocationExplorer";
import { ShowcaseHeading } from "@/components/peach/ShowcaseHeading";
import { Container } from "@/components/ui/Container";
import { drawScribbles, riseIn } from "@/lib/animations";
import { aboutSection } from "@/lib/content";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/** About GramByte: who we are, with an interactive stack of our three markets. */
export function AboutSection() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;
      drawScribbles(root.current);
      riseIn("[data-about-copy] > *", root.current);
      // Animate the cards, not the list items, which carry the fan offsets.
      gsap.from("[data-about-stack] li > div", {
        y: 90,
        autoAlpha: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: "[data-about-stack]", start: "top 75%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="about"
      aria-labelledby="about-title"
      className="gb-section gb-section-burgundy relative py-section text-ink"
    >
      <CurvedEdge />
      <Container>
        <LocationExplorer
          locations={aboutSection.locations}
          localTimeLabel={aboutSection.localTimeLabel}
          pickerLabel={aboutSection.stackHint}
          heading={
            <>
              <ShowcaseHeading
                id="about-title"
                eyebrow={aboutSection.eyebrow}
                title={aboutSection.title}
                accent={aboutSection.accent}
                caps
              />
              <p className="mt-7 max-w-[46ch] text-lead text-ink-2">{aboutSection.intro}</p>
            </>
          }
        />
      </Container>
    </section>
  );
}
