"use client";

import { useRef } from "react";
import type { CardTone } from "@/components/peach/cardTones";
import { CurvedEdge } from "@/components/peach/CurvedEdge";
import { ServiceCard } from "@/components/peach/ServiceCard";
import { ShowcaseHeading } from "@/components/peach/ShowcaseHeading";
import { Container } from "@/components/ui/Container";
import { drawScribbles } from "@/lib/animations";
import { serviceCards, servicesShowcase } from "@/lib/content";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const tones: readonly CardTone[] = ["face", "red", "blush", "snow", "face", "red"];

/** Where each card starts, as a fraction of its own size: a loose pile spread over the stage. */
const scatter = [
  { x: 70, y: 60, rotate: -18 },
  { x: -10, y: 105, rotate: 12 },
  { x: -85, y: 45, rotate: -9 },
  { x: 60, y: -35, rotate: 15 },
  { x: 5, y: 25, rotate: -22 },
  { x: -75, y: -50, rotate: 10 },
];

/**
 * Services as a pile of cards that sorts itself into the grid as you scroll. On large screens
 * the grid pins while the cards travel, and they settle with a slight overshoot so they read
 * as snapping into place. Tablets get the same motion without the pin; phones a simple rise-in.
 * Reduced motion shows the grid.
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
        return { xPercent: s.x, yPercent: s.y, rotate: s.rotate, scale: 0.9 };
      };

      const mm = gsap.matchMedia();
      // Pin only where the whole grid fits in the viewport.
      mm.add("(min-width: 64rem) and (min-height: 44rem)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-service-stage]",
            start: "center 55%",
            end: "+=110%",
            pin: true,
            scrub: 0.8,
          },
        });
        cards.forEach((card, i) => {
          tl.fromTo(
            card,
            from(i),
            { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, ease: "back.out(1.3)", duration: 1 },
            i * 0.06,
          );
        });
        // Hold the finished grid for the last part of the pin.
        tl.to({}, { duration: 0.35 });
      });
      mm.add("(min-width: 48rem) and (max-width: 63.99rem), (min-width: 64rem) and (max-height: 43.99rem)", () => {
        cards.forEach((card, i) => {
          gsap.fromTo(card, from(i), {
            xPercent: 0,
            yPercent: 0,
            rotate: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-service-stage]", start: "top bottom", end: "center 55%", scrub: 0.6 },
          });
        });
      });
      mm.add("(max-width: 47.99rem)", () => {
        cards.forEach((card, i) => {
          gsap.from(card, {
            y: 60,
            rotate: i % 2 ? 5 : -5,
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
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {serviceCards.map((service, i) => (
              <li key={service.id} data-service-card className="relative" style={{ zIndex: (i * 5) % 6 }}>
                <ServiceCard service={service} index={i} tone={tones[i % tones.length]} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
