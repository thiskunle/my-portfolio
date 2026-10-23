"use client";

import Image from "next/image";
import { useRef } from "react";
import { CurvedEdge } from "@/components/peach/CurvedEdge";
import { ShowcaseHeading } from "@/components/peach/ShowcaseHeading";
import { Container } from "@/components/ui/Container";
import { drawScribbles } from "@/lib/animations";
import { brandAssets, storySection } from "@/lib/content";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Below this width the road runs down the left edge instead of winding through the middle. */
const NARROW = 768;

/** A curve from the top of the list, through every milestone dot, to the bottom. */
function roadThrough(list: HTMLElement) {
  const box = list.getBoundingClientRect();
  const dots = [...list.querySelectorAll<HTMLElement>("[data-story-dot]")].map((dot) => {
    const b = dot.getBoundingClientRect();
    return [b.left - box.left + b.width / 2, b.top - box.top + b.height / 2];
  });
  if (!dots.length) return null;

  const swing = innerWidth < NARROW ? 14 : Math.min(150, box.width * 0.12);
  const end = [dots[dots.length - 1][0], box.height];
  let prev = [dots[0][0], 0];
  let d = `M ${prev[0]} ${prev[1]}`;
  [...dots, end].forEach((point, i) => {
    const dir = i % 2 ? 1 : -1;
    const dy = (point[1] - prev[1]) / 2;
    d += ` C ${prev[0] + swing * dir} ${prev[1] + dy}, ${point[0] + swing * dir} ${point[1] - dy}, ${point[0]} ${point[1]}`;
    prev = point;
  });
  return { d, width: box.width, height: box.height };
}

/**
 * Our Story: a road winds through each milestone and draws itself as you scroll, carrying the
 * GramByte mark along it. Paths are written straight to the DOM (no React state), and rebuilt
 * whenever the list resizes.
 */
export function StorySection() {
  const root = useRef<HTMLElement | null>(null);
  const list = useRef<HTMLOListElement | null>(null);
  const svg = useRef<SVGSVGElement | null>(null);
  const road = useRef<SVGPathElement | null>(null);
  const trail = useRef<SVGPathElement | null>(null);
  const walker = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      const el = { list: list.current!, svg: svg.current!, road: road.current!, trail: trail.current!, walker: walker.current! };
      let length = 0;
      let progress = reduce ? 1 : 0;

      const place = () => {
        el.trail.style.strokeDashoffset = `${length * (1 - progress)}`;
        const pt = el.trail.getPointAtLength(length * progress);
        el.walker.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      };

      const build = () => {
        const path = roadThrough(el.list);
        if (!path) return;
        el.svg.setAttribute("viewBox", `0 0 ${path.width} ${path.height}`);
        el.road.setAttribute("d", path.d);
        el.trail.setAttribute("d", path.d);
        length = el.trail.getTotalLength();
        el.trail.style.strokeDasharray = `${length}`;
        place();
      };

      build();
      const observer = new ResizeObserver(build);
      observer.observe(el.list);

      if (!reduce) {
        if (root.current) drawScribbles(root.current);
        ScrollTrigger.create({
          trigger: el.list,
          start: "top 65%",
          end: "bottom 65%",
          scrub: 0.4,
          onUpdate: (self) => {
            progress = self.progress;
            place();
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-story-item]").forEach((item, i) => {
          const dot = item.querySelector("[data-story-dot]");
          gsap
            .timeline({ scrollTrigger: { trigger: item, start: "top 78%" } })
            .from(dot, { scale: 0, duration: 0.6, ease: "back.out(3)" })
            .from(
              item.querySelectorAll("[data-story-card] > *"),
              { x: innerWidth < NARROW ? 40 : i % 2 ? -60 : 60, autoAlpha: 0, stagger: 0.1, duration: 1 },
              0.1,
            );
          // The dot lights up once the drawn road reaches it (same 65% line as the trail).
          ScrollTrigger.create({
            trigger: item,
            start: "center 65%",
            toggleClass: { targets: dot!, className: "is-reached" },
          });
        });
      }

      if (reduce) {
        el.list.querySelectorAll("[data-story-dot]").forEach((dot) => dot.classList.add("is-reached"));
      }

      return () => observer.disconnect();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="story" aria-labelledby="story-title" className="gb-section gb-section-burgundy relative py-section text-ink">
      <CurvedEdge />
      <Container>
        <ShowcaseHeading
          id="story-title"
          eyebrow={storySection.eyebrow}
          title={storySection.title}
          accent={storySection.accent}
          align="center"
        />

        <ol ref={list} className="relative mx-auto mt-16 max-w-5xl sm:mt-24">
          <svg ref={svg} aria-hidden focusable="false" className="pointer-events-none absolute inset-0 size-full overflow-visible">
            <path ref={road} fill="none" className="stroke-white/12" strokeWidth={14} strokeLinecap="round" />
            <path
              ref={trail}
              fill="none"
              className="stroke-snow [filter:drop-shadow(0_0_10px_rgb(255_255_255/0.55))]"
              strokeWidth={7}
              strokeLinecap="round"
            />
          </svg>
          <span
            ref={walker}
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 z-10 -mt-6 -ml-6 grid size-12 place-items-center rounded-full bg-logo-plate p-2 shadow-lift ring-4 ring-snow"
          >
            <Image unoptimized src={brandAssets.mark.src} alt="" width={32} height={26} className="h-auto w-8" />
          </span>

          {storySection.milestones.map((milestone, i) => (
            <li
              key={milestone.id}
              data-story-item
              className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-5 py-10 md:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] md:gap-x-10 md:py-16"
            >
              <span
                data-story-dot
                className="relative z-[5] col-start-1 row-start-1 mx-auto block size-6 rounded-full bg-[var(--section-bg)] ring-4 ring-white/35 transition-[background-color,box-shadow,scale] duration-500 ring-inset [&.is-reached]:scale-125 [&.is-reached]:bg-snow [&.is-reached]:shadow-[0_0_0_10px_rgb(255_255_255/0.14),0_0_24px_rgb(255_255_255/0.5)] md:col-start-2"
              />
              <div
                data-story-card
                className={`col-start-2 row-start-1 ${i % 2 ? "md:col-start-1 md:text-right" : "md:col-start-3"}`}
              >
                {/* The date is the headline; the event reads as its caption. */}
                <p className="font-display text-[clamp(2.75rem,1.6rem+3.6vw,5rem)] leading-[0.9] font-extrabold tracking-tight text-accent uppercase">
                  {milestone.date}
                </p>
                <h3
                  className={`mt-3 max-w-[20ch] font-display text-[clamp(1.375rem,1rem+1.1vw,2rem)] leading-tight font-bold ${
                    i % 2 ? "md:ml-auto" : ""
                  }`}
                >
                  {milestone.title}
                </h3>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
