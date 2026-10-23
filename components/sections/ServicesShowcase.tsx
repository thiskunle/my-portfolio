"use client";

import { useRef } from "react";
import { CurvedEdge } from "@/components/peach/CurvedEdge";
import { ServiceCard } from "@/components/peach/ServiceCard";
import { ShowcaseHeading } from "@/components/peach/ShowcaseHeading";
import { Container } from "@/components/ui/Container";
import { drawScribbles } from "@/lib/animations";
import { serviceCards, servicesShowcase } from "@/lib/content";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/**
 * Where each card starts, as a fraction of its own size: slightly offset and rotated, kept
 * moderate so the artwork stays legible while it travels.
 */
const scatter = [
  { x: 28, y: 30, rotate: -8 },
  { x: -6, y: 48, rotate: 6 },
  { x: -32, y: 22, rotate: -5 },
  { x: 24, y: -14, rotate: 7 },
  { x: 4, y: 18, rotate: -9 },
  { x: -28, y: -10, rotate: 5 },
];

/** Three columns from xl; pin only where both rows of that grid fit on screen. */
const PIN_QUERY = "(min-width: 80rem) and (min-height: 52rem)";

/**
 * Services as rendered artwork cards that drift from a loose, slightly rotated spread into a
 * clean grid as the section scrolls in. On large, tall screens the grid pins while the cards
 * settle; elsewhere on tablet and desktop the same motion runs without the pin; phones get a
 * gentle rise-in with no rotation to speak of. Reduced motion shows the grid.
 */
export function ServicesShowcase() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;
      drawScribbles(root.current);

      const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]");
      const from = (i: number) => {
        const s = scatter[i % scatter.length];
        return { xPercent: s.x, yPercent: s.y, rotate: s.rotate, scale: 0.94 };
      };
      const settled = { xPercent: 0, yPercent: 0, rotate: 0, scale: 1 };

      const mm = gsap.matchMedia();
      mm.add(PIN_QUERY, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: "[data-service-stage]", start: "center 55%", end: "+=90%", pin: true, scrub: 1 },
        });
        cards.forEach((card, i) => {
          tl.fromTo(card, from(i), { ...settled, ease: "power2.out", duration: 1 }, i * 0.05);
        });
        // Hold the finished grid for the last part of the pin.
        tl.to({}, { duration: 0.3 });
      });
      // Tablet and desktop where the pin does not fit (the complement of PIN_QUERY from 48rem up).
      mm.add("(min-width: 48rem) and (max-width: 79.99rem), (min-width: 80rem) and (max-height: 51.99rem)", () => {
        cards.forEach((card, i) => {
          gsap.fromTo(card, from(i), {
            ...settled,
            ease: "power1.out",
            scrollTrigger: { trigger: card, start: "top bottom", end: "top 55%", scrub: 0.8 },
          });
        });
      });
      mm.add("(max-width: 47.99rem)", () => {
        cards.forEach((card, i) => {
          gsap.from(card, {
            y: 48,
            rotate: i % 2 ? 1.5 : -1.5,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="services"
      aria-labelledby="services-title"
      className="gb-section gb-section-cream relative py-section"
    >
      <CurvedEdge flip />
      <Container>
        <ShowcaseHeading
          id="services-title"
          eyebrow={servicesShowcase.eyebrow}
          title={servicesShowcase.title}
          accent={servicesShowcase.accent}
          note={<span className="hidden md:inline">{servicesShowcase.note}</span>}
        />
        <div data-service-stage className="mt-14 sm:mt-20">
          <ul className="grid gap-10 md:grid-cols-2 md:gap-7 xl:grid-cols-3 xl:gap-8">
            {serviceCards.map((service, i) => (
              <li key={service.id} data-service-card className="relative" style={{ zIndex: (i * 5) % 6 }}>
                <ServiceCard service={service} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
