"use client";

import { useRef } from "react";
import { CurvedEdge } from "@/components/peach/CurvedEdge";
import { LocationStack } from "@/components/peach/LocationStack";
import { ShowcaseHeading } from "@/components/peach/ShowcaseHeading";
import { Container } from "@/components/ui/Container";
import { drawScribbles, riseIn } from "@/lib/animations";
import { aboutSection } from "@/lib/content";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/** About GramByte: who we are beside an interactive stack of our three markets. */
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
        rotate: 0,
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
      className="relative bg-tint py-section text-ink"
    >
      <CurvedEdge className="text-tint" />
      <Container className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-24">
        <div data-about-stack className="order-last lg:order-first">
          <LocationStack
            locations={aboutSection.locations}
            localTimeLabel={aboutSection.localTimeLabel}
            hint={aboutSection.stackHint}
          />
        </div>
        <div data-about-copy>
          <ShowcaseHeading
            id="about-title"
            eyebrow={aboutSection.eyebrow}
            title={aboutSection.title}
            accent={aboutSection.accent}
          />
          <p className="mt-7 max-w-[46ch] text-lead text-ink-2">{aboutSection.intro}</p>
        </div>
      </Container>
    </section>
  );
}
