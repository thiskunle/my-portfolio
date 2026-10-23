"use client";

import { useRef } from "react";
import { CurvedEdge } from "@/components/peach/CurvedEdge";
import { Odometer } from "@/components/peach/Odometer";
import { ShowcaseHeading } from "@/components/peach/ShowcaseHeading";
import { Container } from "@/components/ui/Container";
import { drawScribbles } from "@/lib/animations";
import { stats, statsSection } from "@/lib/content";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/** Three headline numbers that roll into place like an odometer as they scroll into view. */
export function StatsSection() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;
      drawScribbles(root.current);

      const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-stats]", start: "top 82%" } });
      tl.from("[data-stat]", { y: 40, autoAlpha: 0, stagger: 0.12, duration: 0.8, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>("[data-odometer-column]").forEach((column, i) => {
        tl.fromTo(
          column,
          // y: 0 discards the resting CSS offset so only yPercent moves the column.
          { y: 0, yPercent: 0 },
          { yPercent: -((10 + Number(column.dataset.digit)) / 20) * 100, duration: 2.2, ease: "power4.out" },
          0.15 + i * 0.08,
        );
      });
      tl.from("[data-stat-line]", { scaleX: 0, stagger: 0.12, duration: 1.2, ease: "expo.inOut" }, 0.4);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="stats" aria-labelledby="stats-title" className="gb-section gb-section-red relative py-section text-ink">
      <CurvedEdge />
      <Container>
        <ShowcaseHeading
          id="stats-title"
          eyebrow={statsSection.eyebrow}
          title={statsSection.title}
          accent={statsSection.accent}
          align="center"
        />
        <dl data-stats className="mt-14 grid gap-12 sm:mt-20 md:grid-cols-3 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.id} data-stat className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-[clamp(5rem,3rem+8vw,10rem)] leading-none font-extrabold tracking-tight">
                <Odometer value={stat.value} suffix={stat.suffix} />
              </dd>
              <dd aria-hidden className="mx-auto mt-5 h-1 w-24 origin-left rounded-full bg-snow" data-stat-line />
              <dd aria-hidden className="mt-5 font-display text-lg font-bold tracking-[0.18em] text-ink-2 uppercase">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
