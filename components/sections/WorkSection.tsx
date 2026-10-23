"use client";

import { useRef } from "react";
import type { CardTone } from "@/components/peach/cardTones";
import { CurvedEdge } from "@/components/peach/CurvedEdge";
import { ProjectCard } from "@/components/peach/ProjectCard";
import { ShowcaseHeading } from "@/components/peach/ShowcaseHeading";
import { Container } from "@/components/ui/Container";
import { drawScribbles } from "@/lib/animations";
import { workSection } from "@/lib/content";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

const tones: readonly CardTone[] = ["face", "blush", "face", "blush", "face", "blush"];

/**
 * Selected work. On wide screens the cards are dealt from a single pile in the middle of the
 * grid into their places; on smaller screens each card rises in as it arrives.
 */
export function WorkSection() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !root.current) return;
      drawScribbles(root.current);

      const mm = gsap.matchMedia();
      mm.add("(min-width: 64rem)", () => {
        const grid = root.current!.querySelector<HTMLElement>("[data-work-grid]")!;
        const cards = gsap.utils.toArray<HTMLElement>("[data-work-card]");
        // Offset from each card's slot to the grid centre, measured at (re)build time.
        const toCentre = (axis: "x" | "y") => (i: number) => {
          const g = grid.getBoundingClientRect();
          const c = cards[i].getBoundingClientRect();
          return axis === "x"
            ? g.left + g.width / 2 - (c.left + c.width / 2)
            : g.top + g.height / 2 - (c.top + c.height / 2) + 60;
        };
        gsap.from(cards, {
          x: toCentre("x"),
          y: toCentre("y"),
          rotate: (i) => (i % 2 ? 1 : -1) * (4 + i * 2),
          scale: 0.85,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: grid, start: "top 70%", invalidateOnRefresh: true },
        });
      });
      mm.add("(max-width: 63.99rem)", () => {
        gsap.utils.toArray<HTMLElement>("[data-work-card]").forEach((card, i) => {
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
    <section ref={root} id="work" aria-labelledby="work-title" className="gb-section gb-section-red relative py-section text-ink">
      <CurvedEdge flip />
      <Container>
        <ShowcaseHeading
          id="work-title"
          eyebrow={workSection.eyebrow}
          title={workSection.title}
          accent={workSection.accent}
        />
        <ul data-work-grid className="mt-14 grid gap-6 sm:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {workSection.projects.map((project, i) => (
            <li key={project.id} data-work-card>
              <ProjectCard
                project={project}
                index={i}
                tone={tones[i % tones.length]}
                pendingLabel={workSection.pendingLabel}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
