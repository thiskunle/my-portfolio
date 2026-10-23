"use client";

import { useRef } from "react";
import type { CardTone } from "@/components/peach/cardTones";
import { ServiceCard } from "@/components/peach/ServiceCard";
import { ShowcaseHeading } from "@/components/peach/ShowcaseHeading";
import { Container } from "@/components/ui/Container";
import { drawScribbles } from "@/lib/animations";
import { serviceCards, servicesShowcase } from "@/lib/content";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const tones: readonly CardTone[] = ["snow", "face", "blush", "face", "blush", "snow"];

/** Where each card starts, as a fraction of its own size, before scrolling tidies it up. */
const scatter = [
  { x: 45, y: 35, rotate: -11 },
  { x: -8, y: 80, rotate: 7 },
  { x: -50, y: 25, rotate: -5 },
  { x: 35, y: -15, rotate: 9 },
  { x: 6, y: 45, rotate: -13 },
  { x: -40, y: -5, rotate: 6 },
];

/**
 * Services as a pile of cards that sorts itself into a grid as the section scrolls up
 * (tablet and wider). On phones each card simply rises in; reduced motion shows the grid.
 */
export function ServicesShowcase() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;
      drawScribbles(root.current);

      const mm = gsap.matchMedia();
      mm.add("(min-width: 48rem)", () => {
        gsap.utils.toArray<HTMLElement>("[data-service-card]").forEach((card, i) => {
          const s = scatter[i % scatter.length];
          gsap.fromTo(
            card,
            { xPercent: s.x, yPercent: s.y, rotate: s.rotate },
            {
              xPercent: 0,
              yPercent: 0,
              rotate: 0,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-service-grid]",
                start: "top bottom",
                end: "center 55%",
                scrub: 0.6,
              },
            },
          );
        });
      });
      mm.add("(max-width: 47.99rem)", () => {
        gsap.utils.toArray<HTMLElement>("[data-service-card]").forEach((card, i) => {
          gsap.from(card, {
            y: 60,
            rotate: i % 2 ? 4 : -4,
            autoAlpha: 0,
            duration: 1,
            scrollTrigger: { trigger: card, start: "top 88%" },
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
      className="relative overflow-clip py-section text-ink"
    >
      <Container>
        <ShowcaseHeading
          id="services-title"
          eyebrow={servicesShowcase.eyebrow}
          title={servicesShowcase.title}
          accent={servicesShowcase.accent}
          note={<span className="hidden md:inline">{servicesShowcase.note}</span>}
        />
        <ul
          data-service-grid
          className="mt-14 grid gap-5 sm:mt-20 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {serviceCards.map((service, i) => (
            <li key={service.id} data-service-card className="relative" style={{ zIndex: i % 3 }}>
              <ServiceCard service={service} index={i} tone={tones[i % tones.length]} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
